export default class AnimateForm{
    static assignAnimation(selector : string){
        document.querySelectorAll(selector).forEach((current) => {
            current.classList.remove('error');
            void (current as HTMLElement).offsetWidth;
            current.classList.add('error');
        });
    }
}