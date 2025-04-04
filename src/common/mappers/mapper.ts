
import {determineCallerAndRecipient} from "../utils/utills";
import {EventEntity} from "../../events/entity/event.entity";
import {User} from "../../user/entities/user.entity";

export const mapEventToDbModel = (eventObj: any): EventEntity => {
    const {callerId, recipientId} = determineCallerAndRecipient(eventObj);
    const timestamp = new Date().toISOString();
    const {
        event,
        channel,
        calleridnum,
        connectedlinenum,
        uniqueid,
        linkedid,
        cause,
        context,
        exten,
        channelstate,
        channelstatedesc,
    } = eventObj
    return {
        callerId,
        recipientId,
        timestamp,
        eventType: event || 'Unknown',
        channel: channel || null,
        callerIdNum: calleridnum || null,
        connectedLineNum: connectedlinenum || null,
        uniqueId: uniqueid || null,
        linkedId: linkedid || null,
        cause: cause || null,
        context: context || null,
        exten: exten || null,
        channelState: channelstate || null,
        channelStateDesc: channelstatedesc || null,
        rawData: eventObj || null,
        causeTxt: eventObj['cause-txt'] || null,
    }
}

export const mapUserToDto= (user: any): User => {
    return {
        id: user.id,
        name: user.name,
        phoneNumber: user.phone_number,
        updatedAt: user.updated_at,
        createdAt: user.created_at,
    }
}