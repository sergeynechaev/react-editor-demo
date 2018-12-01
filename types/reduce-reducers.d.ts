/**
 * SN: I have to wrote my own type definitions for reduce-reducers since original types only
 * describes array of reducers as ...reducers: Array<Reducer<S>> and doesn't consider initialState type
 * as a last parameter.
 *
 * Original types: https://www.npmjs.com/package/@types/reduce-reducers
 */

declare module 'reduce-reducers' {
  import 'reduce-reducers';
  import { Reducer } from 'redux';
  export default function reduceReducer<S>(...reducers: Array<Reducer<S>|S>): Reducer<S>;
}
