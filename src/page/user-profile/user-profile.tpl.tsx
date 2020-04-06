import "./user-profile.scss";

import { tsx } from "springtype/web/vdom";
import { NavHeader } from "../../component/nav-header/nav-header";
import { UserProfilePage } from "./user-profile";
import { ErrorMessage } from "../../component/error-message/error-message";
import { MatModal, MatLoadingIndicator, MatCard } from "st-materialize";
import { T } from "springtype/web/i18n/t";
import { st } from "springtype/core";
import { SupportedLanguages } from "../../service/i18n";
import { ModalMiddleContent } from "../../component/modal-middle-content/modal-middle-content";
import { Center } from "../../component/center/center";

export default (component: UserProfilePage) => (
    <fragment>
        <NavHeader showBackButton={true} />

        <MatLoadingIndicator ref={{ loadingIndicator: component }} />

        <div class="container">
            <div class="row">
                <div class={['col', 's12']}>
                    <Center>
                        <T tag="h5" class="header">My Profil</T>

                        {st.t('Choose language:')}<br />

                        <a href="javascript:" onClick={() => component.setLanguage(SupportedLanguages.DE)}>
                            <img src="https://www.countryflags.io/de/flat/32.png" />
                        </a>
                        <a href="javascript:" onClick={() => component.setLanguage(SupportedLanguages.EN)}>
                            <img src="https://www.countryflags.io/us/flat/32.png" />
                        </a>
                    </Center>
                </div>

            </div>

            <div class="row">

                <div ref={{ formContainer: component }}>
                </div>
                <ErrorMessage ref={{ errorMessage: component }}
                    class={['col', 's12', 'm6', 'offset-m3', 'l4', 'offset-l4']} />

                <a ref={{ submitButton: component }} style={{ marginTop: '10px' }}
                    class={['waves-effect', 'waves-light', 'btn', 'col', 's12', 'm6', 'offset-m3', 'l4', 'offset-l4']}
                    onClick={component.updateUserProfile}>{st.t('Save')}</a>
            </div>
            <div class="row">

                <MatCard>
                    <Center>
                        <T tag="h5">Attention</T>
                        <T tag="p">
                            We can't undo this operation.
                        </T>
                        <br />
                        <br />
                        <a ref={{ deleteButton: component }} class={['waves-effect', 'waves-light', 'btn', 'cancel-button']}
                            onClick={component.deleteUserProfile}>{st.t('Delete user account')}</a>
                    </Center>
                </MatCard>
            </div>
        </div>

        <MatModal ref={{ afterSaveModal: component }}>

            <ModalMiddleContent>
                <T tag="h4" class={'center'}>Profil updated</T>

                <T tag="p">Your personal data was updated successfully.</T>

            </ModalMiddleContent>
            
            <template slot={MatModal.MAT_MODAL_FOOTER_SLOT_NAME}>
                <T tag="a" href="javascript:" onclick={() => {
                    component.afterSaveModal.toggle();
                }} class="modal-close waves-effect waves-red btn-flat">Close</T>
            </template>
        </MatModal>
    </fragment >
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