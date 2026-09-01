import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { imageBase64 } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: 'GEMINI_API_KEY tanımlı değil.' }, { status: 500 });
    }

    // Base64 başlığını temizle
    const base64Data = imageBase64.split(',')[1] || imageBase64;

    const prompt = `Sen uzman bir sporcu diyetisyeni ve besin analiz yapay zekasısın.
Bu tabak fotoğrafındaki yemekleri tespit et, porsiyon gramajlarını tahmin et ve her biri için kalori/makroları hesapla.

Lütfen SADECE geçerli bir JSON dizisi formatında yanıt ver, markdown veya fazladan metin ekleme:
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

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
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
          ],
        }),
      }
    );

    const data = await response.json();
    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || '[]';
    
    // JSON temizleme
    const cleanJson = rawText
      .replace(/```json/gi, '')
      .replace(/```/g, '')
      .trim();

    const items = JSON.parse(cleanJson);

    return NextResponse.json({ items });
  } catch (error) {
    console.error('Vision API Error:', error);
    return NextResponse.json({ error: 'Tabak analiz edilirken hata oluştu.' }, { status: 500 });
  }
}