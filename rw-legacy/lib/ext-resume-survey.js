function fetchSurveyState(phoneNumber) {
    var survey_sessions = project.initDataTableById(service.vars.ExtSurveySessions);
    var cursor = survey_sessions.queryRows({ 'vars': { 'phone_number': phoneNumber } });
    if (!cursor.hasNext()) {
        return null
    }
    var row = cursor.next();
    const nowUnixTimeStamp = new Date().getTime() / 1000;
    const sessionTimeout = 60 * 60;
    return {
        sessionInfo: JSON.parse(row.vars.sessionInfo),
        isExpired: row.time_updated + sessionTimeout < nowUnixTimeStamp,
        remove: function () {
            row.delete();
        }
    }   
}
/**
 * 
 * @param {string} phoneNumber 
 * @param {object} handlers 
 */
function resumeSurvey(phoneNumber, handlers) {
    if(!state.vars.testing){
        var surveyState = fetchSurveyState(phoneNumber);
        if (surveyState == null) {
            return false;
        }
        if (surveyState.isExpired) {
            surveyState.remove()
            return false;
        }
        const savedState = surveyState.sessionInfo.state;
        console.log('### fetched state: '+JSON.stringify(savedState));
        
        for (key in savedState) {
            if (savedState.hasOwnProperty(key)) {
                state.vars[key] = savedState[key];
            }
        }
        // TODO: call handler with input
        const handler = surveyState.sessionInfo.handler;
        const input = surveyState.sessionInfo.input;
        if (handlers[handler]) {
            console.log('#### Found hander');
            handlers[handler](input);
            return true;
        }
        console.log('#### Found no hander');
        
        return false;

    }
    
};

function clearSurveySession(phoneNumber) {
    if(!state.vars.testing){
        var survey_sessions = project.initDataTableById(service.vars.ExtSurveySessions);
        var cursor = survey_sessions.queryRows({ 'vars': { 'phone_number': phoneNumber } });
        if (!cursor.hasNext()) {
            return
        }
        var row = cursor.next();
        row.delete();
    }  
}

/**
 * 
 * @param {string} phoneNumber 
 * @param {object} state 
 * @param {string} handlerName 
 * @param {string} input 
 */
function saveSurveySession(phoneNumber, stateVars, handlerName, input) {
    if(!state.vars.testing){
        const sessionInfo = {
            state: stateVars,
            handler: handlerName,
            input: input
        }
        var survey_sessions = project.initDataTableById(service.vars.ExtSurveySessions);
        var cursor = survey_sessions.queryRows({ 'vars': { 'phone_number': phoneNumber } });
        var row;
        if (cursor.hasNext()) {
            row = cursor.next();
        } else {
            row = survey_sessions.createRow({
                from_number: phoneNumber,
                vars: {}
            });
            console.log('created row');
        }
        console.log(sessionInfo);
    
        row.vars.sessionInfo = JSON.stringify(sessionInfo);
        row.vars.phone_number = phoneNumber
        row.vars.handler = handlerName;
        row.vars.input = input;
        row.save();

    }
    
}
module.exports = {
    resume: resumeSurvey,
    clear: clearSurveySession,
    save: saveSurveySession
}