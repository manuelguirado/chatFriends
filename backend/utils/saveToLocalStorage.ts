function saveMessageTolocalStorage(message: string): void {
  const messages = JSON.parse(localStorage.getItem('messages') || '[]');
  messages.push(message);
  localStorage.setItem('messages', JSON.stringify(messages));
}

export { saveMessageTolocalStorage };
