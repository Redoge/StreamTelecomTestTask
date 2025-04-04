// private
const determineCaller = (event:any):string =>{
    let callerId = '';

    // Визначаємо ID того, хто дзвонить (callerId)
    if (event.calleridnum) {
        callerId = event.calleridnum;
    } else if (event.channel) {
        const callerMatch = event.channel.match(/SIP\/(\d+)-/);
        if (callerMatch && callerMatch[1]) {
            callerId = callerMatch[1];
        }
    }
  return callerId;
}
export const determineRecipient = (event:any):string =>{
    let recipientId = '';

    // Визначаємо ID того, кому дзвонять (recipientId)
    if (event.connectedlinenum && event.connectedlinenum !== '<unknown>') {
        recipientId = event.connectedlinenum;
    } else if (event.exten && event.exten !== '') {
        // Якщо є поле exten, це може бути номер одержувача
        recipientId = event.exten;
    } else if (event.linkedid && event.linkedid === event.uniqueid) {
        // Це оригінальний канал, пробуємо знайти recipient у додаткових даних
        recipientId = '(unknown)';
    }

    // Перевіряємо чи визначено recipientId, якщо все ще невідомо
    if (!recipientId || recipientId === '<unknown>' || recipientId === '') {
        // Спроба визначити з контексту події
        if (event.event === 'Dial' || event.event === 'DialBegin') {
            // Для подій dial перевіряємо додаткові поля
            recipientId = event.dialstring || event.destination || '(unknown)';
        } else {
            recipientId = '(unknown)';
        }
    }
    return recipientId;
}

// public
export const determineCallerAndRecipient = (event: any): { callerId: string, recipientId: string } => {
    const callerId = determineCaller(event);
    const recipientId = determineRecipient(event);
    return { callerId, recipientId };
}