import { FormControl, FormGroup } from "@angular/forms";

export default class ValidateForm{
    static validateAllFormField(formGroup : FormGroup){
      formGroup.markAsDirty({onlySelf: true});
        Object.keys(formGroup.controls).forEach(field => {
          const control = formGroup.get(field);
          if(control instanceof FormControl){
            control.markAsDirty({onlySelf: true})
          }
          else if(control instanceof FormGroup){
            this.validateAllFormField(control);
          }
        })
    }
}