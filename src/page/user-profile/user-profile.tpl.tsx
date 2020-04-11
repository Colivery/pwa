import "./user-profile.scss";

import { tsx } from "springtype/web/vdom";
import { NavHeader } from "../../component/nav-header/nav-header";
import { UserProfilePage } from "./user-profile";
import { ErrorMessage } from "../../component/error-message/error-message";
import { MatModal, MatLoadingIndicator, MatCard, MatLoaderCircle } from "st-materialize";
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

                <MatLoaderCircle ref={{ matLoaderCirclePreFormLoad: component }} class={['col', 's12',]} />

                <div ref={{ formContainer: component }}>
                </div>
                <ErrorMessage ref={{ errorMessage: component }}
                    class={['col', 's12', 'm6', 'offset-m3', 'l4', 'offset-l4']} />

                <a ref={{ submitButton: component }} style={{ marginTop: '10px' }}
                    class={['waves-effect', 'waves-light', 'btn', 'col', 's12', 'm6', 'offset-m3', 'l4', 'offset-l4', 'disabled']}
                    onClick={component.updateUserProfile}>{st.t('Save')}</a>
            </div>
            <div class="row">

                <MatCard>
                    <Center>
                        <T tag="h5">Attention</T>
                        <T tag="p">
                            Please note that for privacy reasons, your user account will be deleted after the end of the test phase.
                        </T>
                        {/*
                        <br />
                        <br />
                        <a ref={{ deleteButton: component }} class={['waves-effect', 'waves-light', 'btn', 'cancel-button']}
                            onClick={component.deleteUserProfile}>{st.t('Delete user account')}</a>
                        */}
                    </Center>
                </MatCard>
            </div>
        </div>

        <MatModal ref={{ afterSaveModal: component }}>

            <ModalMiddleContent>
                <Center>
                    <T tag="h4" class={'center'}>Profil updated</T>

                    <T tag="p">Your personal data was updated successfully.</T>
                </Center>
            </ModalMiddleContent>

            <template slot={MatModal.MAT_MODAL_FOOTER_SLOT_NAME}>
                <T tag="a" href="javascript:" onclick={() => {
                    component.afterSaveModal.toggle();
                }} class="modal-close waves-effect waves-red btn-flat">Close</T>
            </template>
        </MatModal>

        <MatModal ref={{ beforeUserDeleteModal: component }}>

            <ModalMiddleContent>
                <Center>
                    <T tag="h4" class={'center'}>Please confirm</T>

                    <T tag="p">Deletion of your user account is permanent, it can't be undone.</T>
                </Center>
            </ModalMiddleContent>

            <template slot={MatModal.MAT_MODAL_FOOTER_SLOT_NAME}>

                <a href="javascript:" onclick={() => component.beforeUserDeleteModal.toggle()} class="modal-close waves-effect btn-footer-secondary waves-white btn material-align-middle"><i class="material-icons">highlight_off</i> &nbsp;{st.t("No")}</a>
                <a href="javascript:" onclick={component.reallyDeleteUser} class="modal-close waves-effect btn waves-white material-align-middle cancel-button"><i class="material-icons">done_all</i> &nbsp;{st.t("Yes")}</a>

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