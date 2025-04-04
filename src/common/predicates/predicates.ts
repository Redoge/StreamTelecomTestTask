export const isQoSEvent = (event: any): boolean => {
    return event.variable?.RTPAUDIOQOS !== undefined ||
        event.variable?.RTPAUDIOQOSJITTER !== undefined ||
        event.variable?.RTPAUDIOQOSLOSS !== undefined ||
        event.variable?.RTPAUDIOQOSRTT !== undefined
}