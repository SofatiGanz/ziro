const linkRegex = /chat.whatsapp.com\/(?:invite\/)?([0-9A-Za-z]{20,24})/i;

export async function before(m, { isAdmin, isBotAdmin }) {
  if (m.isBaileys || !m.isGroup) return false;

  const chat = global.db.data.chats[m.chat];
  const isGroupLink = linkRegex.exec(m.text);
  const kickMessage = isAdmin
    ? `*『 𝙂𝙍𝙊𝙐𝙋 𝙇𝙄𝙉𝙆 𝘿𝙀𝙏𝙀𝙆𝙏𝙊𝙍 』*\nAnda admin grup tidak bisa dikeluarkan dari grup.`
    : `*『 𝙂𝙍𝙊𝙐𝙋 𝙇𝙄𝙉𝙆 𝘿𝙀𝙏𝙀𝙆𝙏𝙊𝙍 』*\nAnda akan dikeluarkan dari grup.`;

  if (chat.antiLink && isGroupLink) {
    await this.reply(m.chat, kickMessage, null, { mentions: [m.sender] });
    await this.sendMessage(m.chat, { delete: m.key });

    if ((!isBotAdmin && isAdmin) || (isBotAdmin && !isAdmin)) {
      await this.groupParticipantsUpdate(m.chat, [m.sender], 'remove');
      await this.reply(m.chat, kickMessage, null, { mentions: [m.sender] });
      await this.sendMessage(m.chat, { delete: m.key });
    }
  }
  return true;
}
