/** Observer: objeto que reacciona cuando el sujeto publica un evento. */
export interface IObserver<TEvent> {
  update(event: TEvent): Promise<void>;
}
