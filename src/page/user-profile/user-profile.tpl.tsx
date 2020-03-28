import { tsx } from "springtype/web/vdom";
import { NavHeader } from "../../component/nav-header/nav-header";
import { UserProfile } from "./user-profile";
import { Form, Input } from "springtype/web/form";
import { MatInput } from "../../component/mat/mat-input";
import { email, required } from "springtype/core/validate";
import { MatTextarea } from "../../component/mat/mat-textarea";
import { MatCheckbox } from "../../component/mat/mat-checkbox";
import { ErrorMessage } from "../../component/error-message/error-message";
import { OlMap } from "../../component/ol-map/ol-map";
import { MatModal } from "../../component/mat/mat-modal";
import { MatLoadingIndicator } from "../../component/mat/mat-loading-indicator";
import { calculateAvailableHeightPercent } from "../../function/calculate-available-height-percent";

export default (component: UserProfile) => (
    <fragment>
        <NavHeader showBackButton={true} onAddButtonClick={component.onAddButtonClick} />

        <MatLoadingIndicator ref={{ loadingIndicator: component }} />

        <div class="container">
            <div class="row">
                <div class={['col', 's12']}>
                    <center>
                        <h5 class="header">Mein Profil</h5>
                    </center>
                </div>
                <Form ref={{ formRef: component }}>
                    {getFormInputs(component)}
                </Form>

                <ErrorMessage ref={{ errorMessage: component }}
                    class={['col', 's12', 'm6', 'offset-m3', 'l4', 'offset-l4']} />

                <a class={['waves-effect', 'waves-light', 'btn', 'col', 's12', 'm6', 'offset-m3', 'l4', 'offset-l4']}
                    onClick={component.updateUserProfile}>Speichern</a>
            </div>
        </div>

        <MatModal ref={{ afterSaveModal: component }}>

            <h4 class={'center'}>Profil aktualisiert</h4>

            Deine persönlichen Daten wurden erfolgreich aktualisiert.

            <template slot={MatModal.MAT_MODAL_FOOTER_SLOT_NAME}>
                <a href="javascript:" onclick={() => {
                    component.afterSaveModal.toggle();
                }} class="modal-close waves-effect waves-red btn-flat">Schließen</a>
            </template>
        </MatModal>
    </fragment>
)

const getFormInputs = (component: UserProfile) => {
    if (component.state) {
        return <fragment>
            <MatInput style={{ display: 'none' }} name="id" label="Id"
                class={['col', 's12', 'm6']}
                helperText="Your user Id"
                disabled={true}
                value={component.state.user_id}
            />
            <MatInput name="email" label="E-Mail"
                class={['col', 's12', 'm6']}
                disabled={true}
                helperText="Deine E-Mail-Adresse"
                validators={[required, email]}
                value={component.state.email}
                errorMessage={{
                    required: 'Das ist ein Pflichtfeld',
                    'email': 'Keine gültige E-Mail'
                }}>
            </MatInput>
            <MatInput name="name" label="Vorname"
                class={['col', 's6', 'm3']}
                helperText="z.B. Max"
                validators={[required]}
                value={component.state.firstname}
                errorMessage={{
                    required: 'Das ist ein Pflichtfeld'
                }}>
            </MatInput>

            <MatInput name="name" label="Nachname"
                class={['col', 's6', 'm3']}
                helperText="z.B. Mustermann"
                validators={[required]}
                value={component.state.lastname}
                errorMessage={{
                    required: 'Das ist ein Pflichtfeld'
                }}>
            </MatInput>
            <MatInput name="phone" label="Phone"
                class={['col', 's12', 'm6']}
                helperText="Enter your phone number here"
                validators={[required]}
                value={component.state.phone}
                errorMessage={{
                    required: 'Das ist ein Pflichtfeld'
                }}>
            </MatInput>
            <MatTextarea ref={{ addressRef: component }} name="address" label="Wohl/Lieferadresse"
                class={['col', 's12', 'm6']}
                helperText="Wohin die Fahrer*in kommen soll"
                validators={[required, component.addressValidator()]}
                value={component.state.address}
                errorMessage={{
                    required: 'Das ist ein Pflichtfeld',
                    address: 'Diese Adresse können wir nicht verstehen'
                }}>
            </MatTextarea>
            <div class={['col', 's12']}>
                <OlMap height={calculateAvailableHeightPercent(20)} ref={{ olMapRef: component }} hideZoom={false} /><br />
            </div>
        </fragment>
    }
    return <fragment />
};

export interface IUserProfileFromState {
    id: string;
    email: string
    firstname: string;
    lastname: string;
    phone: string
    address: string
    accepted_support_inquiry: boolean;
}