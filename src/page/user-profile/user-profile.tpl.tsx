import "./user-profile.scss";

import { tsx } from "springtype/web/vdom";
import { NavHeader } from "../../component/nav-header/nav-header";
import { UserProfilePage } from "./user-profile";
import { ErrorMessage } from "../../component/error-message/error-message";
import { MatModal } from "../../component/mat/mat-modal";
import { MatLoadingIndicator } from "../../component/mat/mat-loading-indicator";
import { st } from "springtype/core";

export default (component: UserProfilePage) => (
    <fragment>
        <NavHeader showBackButton={true} />

        <MatLoadingIndicator ref={{ loadingIndicator: component }} />

        <div class="container">
            <div class="row">
                <div class={['col', 's12']}>
                    <center>
                        <h5 class="header">{st.t("My Profil")}</h5>
                    </center>
                </div>

                <div ref={{ formContainer: component}}>
                </div>
                <ErrorMessage ref={{ errorMessage: component }}
                    class={['col', 's12', 'm6', 'offset-m3', 'l4', 'offset-l4']} />

                <a ref={{ submitButton: component }} style={{ marginTop: '10px' }} class={['waves-effect', 'waves-light', 'btn', 'col', 's12', 'm6', 'offset-m3', 'l4', 'offset-l4']}
                    onClick={component.updateUserProfile}>{st.t("Save")}</a>
            </div>
        </div>

        <MatModal ref={{ afterSaveModal: component }}>

            <h4 class={'center'}>{st.t("Profil updated")}</h4>

            {st.t("Your personal data was updated successfully.")}

            <template slot={MatModal.MAT_MODAL_FOOTER_SLOT_NAME}>
                <a href="javascript:" onclick={() => {
                    component.afterSaveModal.toggle();
                }} class="modal-close waves-effect waves-red btn-flat">{st.t("Close")}</a>
            </template>
        </MatModal>
    </fragment>
)

export interface IUserProfileFromState {
    id: string;
    email: string
    first_name: string;
    last_name: string;
    phone: string
    address: string
    accepted_support_inquiry: boolean;
}