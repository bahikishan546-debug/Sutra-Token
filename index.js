const { Telegraf } = require('telegraf');
const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Security Check: Ensure BOT_TOKEN is provided
if (!process.env.BOT_TOKEN) {
    console.error("❌ ERRROR: BOT_TOKEN is missing in Environment Variables!");
    process.exit(1);
}

const bot = new Telegraf(process.env.BOT_TOKEN);

// Serve static frontend files safely
app.use(express.static(path.join(__dirname, 'public')));

// Fallback route for health check
app.get('/health', (req, res) => {
    res.status(200).send('Sutra Token Ecosystem is Active & Secure.');
});

// Professional Start Command with Mini-App Button
bot.start((ctx) => {
    const userName = ctx.from.first_name || "Miner";
    
    // Auto-detect Render Web Service URL or fallback
    const renderUrl = process.env.RENDER_EXTERNAL_URL || `https://sutra-token.onrender.com`;

    ctx.reply(
        `👋 Welcome, *${userName}*!\n\n` +
        `🚀 *Sutra Token ($SUTRA)* के ऑफिशियल माइनिंग इकोसिस्टम में आपका स्वागत है।\n\n` +
        `⛏️ हर 24 घंटे माइन करें, वीडियो ऐड देखकर बूस्ट लें, और जल्द ही इसे 1,000:1 के रेट पर *\$SST Coin* में बदलें!\n\n` +
        `नीचे दिए गए बटन पर क्लिक करके अपनी माइनिंग ऐप खोलें:`,
        {
            parse_mode: 'Markdown',
            reply_markup: {
                inline_keyboard: [
                    [{ text: "🪙 Open Mining App", web_app: { url: renderUrl } }],
                    [{ text: "📢 Join Community", url: "https://t.me/sutra_token" }]
                ]
            }
        }
    );
});

// Error handling to prevent bot crashes from hackers or bad inputs
bot.catch((err, ctx) => {
    console.error(`⚠️ Telegram Bot Error for ${ctx.updateType}:`, err);
});

// Launch Bot & Server securely
bot.launch().then(() => {
    console.log("🚀 Sutra Token Telegram Bot is securely running!");
}).catch((err) => {
    console.error("❌ Failed to launch bot:", err);
});

app.listen(PORT, () => {
    console.log(`🌐 Secure Web Server running on port ${PORT}`);
});

// Enable graceful stop for security & stability
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
