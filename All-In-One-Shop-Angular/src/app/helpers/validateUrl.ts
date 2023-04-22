export default class UrlValidator{
    static testUrl(url: string): boolean{
        const imgUrlpattern = new RegExp('^https?:\\\/\\\/(?:www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b(?:[-a-zA-Z0-9()@:%_\\+.~#?&\\\/=]*)$');
        return imgUrlpattern.test(url);
    }
}