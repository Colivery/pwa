import { ResetPasswordPage } from "./reset-password";
import { tsx } from "springtype/web/vdom";
import { ErrorMessage } from "../../component/error-message/error-message";
import { MatInput, MatForm, MatLoaderCircle } from "st-materialize";
import { required, minLength } from "springtype/core/validate";
import { LogoRow } from "../../component/logo-row/logo-row";
import { st } from "springtype/core";
import { Center } from "../../component/center/center";
import { validatorNameFactory } from "springtype/core/validate/function/validator-name-factory";

export default (component: ResetPasswordPage) => (
    <fragment>
        <div class="container">
            <LogoRow />

            <h3 class="slogan">
                {st.t("New password")}
            </h3>

            <MatForm ref={{ form: component }}>
                <div class="row">

                    <MatInput name="newPassword" ref={{ newPasswordRef: component }} label={st.t("New password")} type="password"
                        class={['col', 's12', 'm6', 'offset-m3', 'l6', 'offset-l3']}
                        helperText={st.t("Choose your password")}
                        validators={[required, minLength(7)]}
                        onValidation={() => {
                            if (component.newPasswordAgainRef.inputRef.value !== '') {
                                component.newPasswordAgainRef.validate(true);
                            }
                        }}
                        validationErrorMessages={{
                            required: st.t("This is a required field"),
                            'min-length': st.t("Passwords consist of atleast 7 characters")
                        }}>
                    </MatInput>
                    
                    <MatInput name="newPasswordAgain" ref={{ newPasswordAgainRef: component }} label={st.t("Repeat new password")} type="password"
                        class={['col', 's12', 'm6', 'offset-m3', 'l6', 'offset-l3']}
                        helperText={st.t("Confirm your password")}
                        validators={[required, minLength(7), validatorNameFactory((value: string) => {
                            return component.newPasswordRef.getValue() === value;
                        }, 'same')]}
                        validationErrorMessages={{
                            required: st.t("This is a required field"),
                            'min-length': st.t("Passwords consist of atleast 7 characters"),
                            same: st.t('Both passwords have to match')
                        }}>
                    </MatInput>
                </div>
                <div class="row">
                    <MatLoaderCircle ref={{ matLoaderCircleRef: component }} class="hide" />
                </div>
                <div class="row" ref={{ errorMessageContainer: component }}>
                    <ErrorMessage ref={{ errorMessage: component }}
                        class={['col', 's12', 'm6', 'offset-m3', 'l6', 'offset-l3']} />
                </div>
                <div class="row" ref={{ loginButtonContainer: component }}>
                    <Center class={['col', 's12', 'm6', 'offset-m3', 'l6', 'offset-l3']}>

                        <a class={['waves-effect', 'waves-light', 'btn', 'login-button', 'mat-align-middle']}
                            ref={{ changePasswordButtonRef: component }}
                            onClick={component.onNextClick}>{st.t("Change password")}</a>
                    </Center>
                </div>
            </MatForm>
        </div>
    </fragment >
);