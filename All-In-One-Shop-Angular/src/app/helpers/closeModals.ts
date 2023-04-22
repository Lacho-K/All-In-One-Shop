export default class ModalCloser{
    static closeOpenModals(){
        const elements = document.getElementsByClassName('btn-close');
        Array.from(elements).forEach(element => (element as HTMLButtonElement).click());
    }
}