import {st} from "springtype/core";
import {ILifecycle} from "springtype/web/component/interface";
import {tsx} from "springtype/web/vdom";
import {attr, component} from "springtype/web/component";
import {Input} from "springtype/web/form";
import {ref} from "springtype/core/ref";
import {required} from "springtype/core/validate";

export interface IAttrMatInput {
    name: string;
    disabled?: boolean;
    label?: string;
    required?: boolean;
    checked?: boolean;
}


@component({tag: 'label'})
export class MatCheckbox extends st.component<IAttrMatInput> implements ILifecycle {

    @ref
    inputRef: Input;

    @attr
    name: string;

    @attr
    label: string;

    @attr
    disabled: boolean = false;

    @attr
    required: boolean = false;

    @attr
    checked: boolean = false;


    render() {
        return <fragment>
            <Input ref={{inputRef: this}} name={this.name} type="checkbox" disabled={this.disabled}
                   validators={this.getValidators()} checked={this.checked}/>
            <span>{this.label}</span>
        </fragment>
    }

    onAfterRender(): void {
        (this.inputRef.el as HTMLInputElement).checked = this.checked;
    }

    private getValidators() {
        if (this.required) {
            return [required];
        }
        return [];
    }
}