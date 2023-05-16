import { FormControl, ValidationErrors } from "@angular/forms";

export class BoltFormValidators {

    static invalidSpaceChars(control: FormControl): ValidationErrors {

        if ((control.value != null) && (control.value.trim().length === 0)) {

            // return error, invalid 
            return { 'invalidSpaceChars': true };
        }
        else {

            // return null, valid
            return null;
        } 
    }
}
