import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { imageBase64, textPrompt } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: 'GEMINI_API_KEY tanımlı değil.' }, { status: 500 });
    }

    let contents = [];

    if (textPrompt) {
      // Doğal Dil Metin Analizi
      const prompt = `Sen uzman bir sporcu diyetisyeni ve besin analizi yapay zekasısın.
Kullanıcının yediğini anlattığı şu metni analiz et: "${textPrompt}".
Metindeki tüm yiyecekleri tespit et, porsiyon/gramajlarını çıkar, her birinin kalori, protein, karbonhidrat ve yağ değerlerini hesapla.

Lütfen SADECE geçerli bir JSON dizisi formatında yanıt ver, markdown backtick veya açıklama metni ekleme:
[
  {
    "name": "Haşlanmış Yumurta (3 Adet)",
    "grams": 150,
    "kcal": 216,
    "p": 18.9,
    "c": 1.2,
    "f": 14.4,
    "confidence": "%99"
  }
]`;
      contents = [{ parts: [{ text: prompt }] }];
    } else if (imageBase64) {
      // Vision Fotoğraf Analizi
      const base64Data = imageBase64.split(',')[1] || imageBase64;
      const prompt = `Sen uzman bir sporcu diyetisyeni ve besin görüntü işleme yapay zekasısın.
Bu tabak fotoğrafındaki yemekleri tespit et, porsiyon gramajlarını tahmin et ve her biri için kalori/makroları hesapla.

Lütfen SADECE geçerli bir JSON dizisi formatında yanıt ver, markdown backtick veya açıklama metni ekleme:
[
  {
    "name": "Izgara Tavuk Göğsü",
    "grams": 200,
    "kcal": 240,
    "p": 45.0,
    "c": 0.0,
    "f": 5.0,
    "confidence": "%95"
  }
]`;
      contents = [
        {
          parts: [
            { text: prompt },
            {
              inline_data: {
                mime_type: 'image/jpeg',
                data: base64Data,
              },
            },
          ],
        },
      ];
    } else {
      return NextResponse.json({ error: 'Fotoğraf veya açıklama metni gereklidir.' }, { status: 400 });
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents }),
      }
    );

    const data = await response.json();
    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || '[]';
    const cleanJson = rawText.replace(/```json/gi, '').replace(/```/g, '').trim();
    const items = JSON.parse(cleanJson);

    return NextResponse.json({ items });
  } catch (error) {
    console.error('Vision/Text API Error:', error);
    return NextResponse.json({ error: 'Analiz edilirken hata oluştu.' }, { status: 500 });
  }
}