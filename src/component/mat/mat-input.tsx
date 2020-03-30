import {st} from "springtype/core";
import {ILifecycle} from "springtype/web/component/interface";
import {tsx} from "springtype/web/vdom";
import {attr, component} from "springtype/web/component";
import {Input} from "springtype/web/form";
import {getUniqueHTMLId} from "../../function/get-unique-html-id";
import {ref} from "springtype/core/ref";
import {StValidationEvent} from "springtype/web/form/component/validation-component";

export interface IAttrMatInput {
    name: string;
    label: string;
    type?: string;
    value?: string;
    disabled?: boolean;
    helperText?: string;
    validators?: Array<(value: string) => Promise<boolean>>;
    successMessage?: string;
    errorMessage?: { [error: string]: string };
    rows?: number;
    max?: number;
}

const MAT_SPAN_ERROR_ATTRIBUTE = 'data-error';

@component({tag: 'div'})
export class MatInput extends st.component<IAttrMatInput> implements ILifecycle {
    static MAT_INPUT_BEFORE_INPUT_SLOT_NAME = 'MAT_INPUT_BEFORE_INPUT_SLOT_NAME';

    @ref
    inputRef: Input;

    @ref
    helperSpanRef: HTMLSpanElement;

    @ref
    labelRef: HTMLLabelElement;

    @attr
    name: string;

    @attr
    value: string = '';

    @attr
    disabled: boolean = false;

    @attr
    label: string;

    @attr
    type: string = 'text';

    @attr
    validators: Array<(value: string) => Promise<boolean>> = [];

    @attr
    helperText: string = '';

    @attr
    successMessage: string = ' ';

    @attr
    errorMessage: { [error: string]: string } = {};

    @attr
    rows: number = 1;

    @attr
    max: number = 255;

    internalValue: string;

    render() {
        const id = getUniqueHTMLId();
        return <div class={['input-field']}>
            {this.renderSlot(MatInput.MAT_INPUT_BEFORE_INPUT_SLOT_NAME)}
            <Input ref={{inputRef: this}} id={id} type={this.type} name={this.name} validators={this.validators}
                   disabled={this.disabled} value={this.value}
                   rows={this.rows}
                   max={this.max.toString()}
                   onStValidation={(evt) => {
                       this.onChange(evt)
                   }}/>
            <label ref={{labelRef: this}} for={id} class={this.getLabelClasses()}>{this.label}</label>
            <span ref={{helperSpanRef: this}} class="helper-text"
                  data-success={this.successMessage}>{this.helperText}</span>
        </div>
    }

    onAfterRender(hasDOMChanged: boolean): void {
        if(this.internalValue){
           this.labelRef.classList.add(...this.inputRef.getActiveLabelClasses());
        }
    }

    onChange(evt: StValidationEvent) {
        this.internalValue = evt.detail.value;
        this.helperSpanRef.removeAttribute(MAT_SPAN_ERROR_ATTRIBUTE);
        if (!evt.detail.valid) {
            const error = this.getError(evt.detail.errors);
            if (error) {
                this.helperSpanRef.setAttribute(MAT_SPAN_ERROR_ATTRIBUTE, error);
            }
        }
    }

    getLabelClasses() {
        if (this.value) {
            return st.form.labelActiveClasses;
        }
        return [];
    }

    getError(errors: Array<string>) {
        for (const error of errors) {
            const message = this.errorMessage[error];
            if (message) {
                return message;
            }
        }
    }

}