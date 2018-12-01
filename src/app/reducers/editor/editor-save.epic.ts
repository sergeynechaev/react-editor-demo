import { ofType, StateObservable } from 'redux-observable';
import { delay, map, mergeMap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { EditorActions } from 'app/actions';
import { Action } from 'redux-actions';
import { EditorModel } from 'app/models';

const fakeRequest = (url: string): Observable<EditorModel.ResponseData> => of({
  success: true,
  error: ''
}).pipe(delay(1000));

export const editorSave = (
  action$: Observable<Action<EditorModel.Content[]>>,
  state$: StateObservable<void> // obviously it's unused element since we get data from action.payload
): Observable<Action<EditorModel.ResponseData>> => {

  return action$.pipe(
    ofType(EditorActions.Type.SAVE),
    mergeMap((action, state) => {
      const fakeData = {
        content: action.payload
      };
      return fakeRequest(`/api/v1/editor/content/${fakeData}`).pipe(
        map(payload => {
          return {
            type: EditorActions.Type.SAVING_COMPLETE,
            payload
          }
        })
      );
    })
  );

};
