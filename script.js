// HTMLの要素（パーツ）を取得
const memoInput = document.getElementById('memoInput');
const aiButton = document.getElementById('aiButton');
const saveButton = document.getElementById('saveButton');
const outputArea = document.getElementById('outputArea');

// 1. ページ読み込み時の処理
window.addEventListener('DOMContentLoaded', () => {
    const savedMemo = localStorage.getItem('myMemo');
    if (savedMemo) {
        memoInput.value = savedMemo;
        outputArea.textContent = '保存されていたメモを読み込みました！';
    }
});

// 2. 「ローカルに保存」ボタン
saveButton.addEventListener('click', () => {
    const text = memoInput.value;
    localStorage.setItem('myMemo', text);
    outputArea.textContent = '💾 メモをブラウザに保存しました！';
});

// 3. 「AIにお願いする」ボタン（安全なAPIキー呼び出し）
aiButton.addEventListener('click', async () => {
    const text = memoInput.value;
    
    if (text.trim() === '') {
        outputArea.textContent = '⚠️ まずはメモ欄に何か文字を入力してくださいね！';
        return;
    }

    // ブラウザに保存されているAPIキーを読み込む（なければユーザーに入力を促す）
    let apiKey = localStorage.getItem('geminiApiKey');
    
    if (!apiKey) {
        apiKey = prompt('【初回のみ】Gemini APIキーを入力してください（ブラウザ内にのみ安全に保存されます）：');
        if (!apiKey || apiKey.trim() === '') {
            outputArea.textContent = '⚠️ APIキーが入力されなかったため、AIを実行できません。';
            return;
        }
        localStorage.setItem('geminiApiKey', apiKey.trim());
    }

    outputArea.textContent = '🤖 AIが考えています...少々お待ちください。';

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    const promptText = "以下のメモについて、要約やアドバイス、感想などを優しく答えてください。\n\nメモ内容: " + text;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: promptText }] }]
            })
        });

        const data = await response.json();
        
        if (data.candidates && data.candidates[0].content.parts[0].text) {
            const aiReply = data.candidates[0].content.parts[0].text;
            outputArea.textContent = '【AIからの返答】\n' + aiReply;
        } else {
            outputArea.textContent = '⚠️ AIからの返答に失敗しました。APIキーが正しいか確認してください。（キーをリセットしたい場合はブラウザのデータをクリアしてください）';
            // 間違ったキーが保存されている場合に備えてクリアする選択肢も持たせられます
        }

    } catch (error) {
        console.error(error);
        outputArea.textContent = '⚠️ 通信エラーが発生しました。インターネット接続を確認してください。';
    }
});