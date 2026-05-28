import type { AuthData, ReducerAction } from "../services/types";

export const initData:AuthData={
    user: null,
    token:null,
    isGuest: true,
    isLoad: true
}
export function actionReducer(state: AuthData, action: ReducerAction):AuthData{
    switch(action.type){
        case 'LOAD':{
            return {...state, isLoad:true}
        }
        case 'LOGIN_FAIL':{
            return{...initData, isLoad: false}
        }
        case 'LOGIN_SUCCESS':{
            return {user: action.payload.user, 
                token: action.payload.token,
            isGuest: false, isLoad: false }
        }
        case 'LOGOUT':{
            return{...initData, isLoad: false}
        }
        default:
        return state;
    }

}