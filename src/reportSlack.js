const axios = require('axios');
const fs = require('fs');

(async () => {
    const severLog = fs.readFileSync('./src/2024-03-16.log').toString();
    console.log(severLog);
    // await axios.post('https://hooks.slack.com/services/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', { attachments: [{
    //     color: '#29FFF2',
    //     title: '테스트 메시지!',
    //     text: new Date().toDateString(),
    //     fields: [{ title: '현재 시각', value: new Date().toDateString(), short: false }],
    //   }] })
})();