import { st } from "springtype/core";
import { event } from "springtype/web/component/decorator/event";
import { attr, component } from "springtype/web/component";
import { tsx } from "springtype/web/vdom";
import "./nav-header.scss";
import { ref } from "springtype/core/ref";
import { UserProfile } from "../../page/user-profile/user-profile";
import { inject } from "springtype/core/di";
import { PreferenceService } from "../../service/preference";
import { ConsumerOrderListPage } from "../../page/consumer-order-list/consumer-order-list";
import { DriverOrderList } from "../../page/driver/driver-order-list/driver-order-list";
import { TERMS_OF_USE_URL, PRIVACY_STATEMENT_URL } from "../../config/website-urls";

export interface NavHeaderProps {
    showBackButton?: boolean;
}

@component
export class NavHeader extends st.component<NavHeaderProps> {

    @inject(PreferenceService)
    preferenceService: PreferenceService;

    @ref
    dropDownContentRef: HTMLUListElement;

    @ref
    dropDownLiRef: HTMLLIElement;

    @ref
    menuIcon: HTMLElement;

    @ref
    menuOverlay: HTMLElement;

    @attr
    showBackButton: boolean = true;

    onLogoutClick = () => {
        console.log('logout click');
        this.resetBodyOverflowBehaviour();
        window.authService.logout();
    };


    onBackButtonClick = () => {
        console.log('back click');
        window.history.back();
    };

    resetBodyOverflowBehaviour() {

        setTimeout(() => {
            document.body.style.overflow = 'inherit';
            document.body.style.overflowX = 'hidden';
        }, 200 /* wait for animation to finish*/);
    }

    toggleMenu = () => {

        if (this.menuIcon.classList.contains('open')) {
            this.resetBodyOverflowBehaviour();
        } else {
            document.body.style.overflow = 'hidden';
        }
        this.menuIcon.classList.toggle('open');
        this.menuOverlay.classList.toggle('open');
        this.el.querySelectorAll('.action-button').forEach((el: HTMLElement) => {
            el.classList.toggle('hide');
        });
    }

    render() {
        return <fragment>
            <nav class="nav-extended">
                <div class="nav-wrapper" >
                    <div class="brand-logo">
                        <img class="nav-brand-logo" src={require('../../../assets/images/logo_fullcolor_cubic.png')} />
                    </div>

                    {this.showBackButton ?
                        <a class='left-btn-position btn btn-flat btn-small' href='javascript:' onClick={() => {
                            this.onBackButtonClick()
                        }}>
                            <i class="material-icons">arrow_back_ios</i>
                        </a> : <div class="menu left-btn-position" ref={{ menuIcon: this }}>
                            <span class="menu-circle"></span>
                            <a href="javascript:" onclick={this.toggleMenu} class="menu-link">
                                <span class="menu-icon">
                                    <span class="menu-line menu-line-1"></span>
                                    <span class="menu-line menu-line-2"></span>
                                    <span class="menu-line menu-line-3"></span>
                                </span>
                            </a>
                        </div>}
                </div>
            </nav>

            <div class="menu-overlay" ref={{ menuOverlay: this }}>
                <a href="javascript:" onClick={() => {
                    this.onUserProfileClick()
                }}>
                    <div class="material-align-middle">
                        <i class="material-icons">account_circle</i> Mein Profil
                    </div>
                </a>
                {this.getActiveMode()}

                <a href={TERMS_OF_USE_URL} target="_blank">
                    <div class="material-align-middle">
                        <i class="material-icons">description</i> AGB
                    </div>
                </a>

                <a href={PRIVACY_STATEMENT_URL} target="_blank">
                    <div class="material-align-middle">
                        <i class="material-icons">security</i> Datenschutz
                    </div>
                </a>

                <a href="javascript:" onclick={() => {
                    this.onLogoutClick()
                }}>
                    <div class="material-align-middle">
                        <i class="material-icons">directions_run</i> Ausloggen
                    </div>
                </a>
            </div>

        </fragment>
    }

    onUserProfileClick = () => {
        this.toggleMenu();
        st.route = {
            path: UserProfile.ROUTE
        }
    };


    onCustomerSwitch = () => {
        this.toggleMenu();
        this.preferenceService.setProfile('consumer');
        st.debug('onCustomerSwitch');
        st.route = {
            path: ConsumerOrderListPage.ROUTE
        }

    };

    onDriverSwitch = () => {
        this.toggleMenu();
        this.preferenceService.setProfile('driver');
        st.debug('onDeviceSwitch');
        st.route = {
            path: DriverOrderList.ROUTE
        }

    };

    private getActiveMode() {
        const isDriver = this.preferenceService.getProfile() === 'driver';
        return <fragment>
            <a href="javascript:" style={{ display: isDriver ? 'block' : 'none' }} onclick={() => {
                this.onCustomerSwitch();
            }}>
                <div class="material-align-middle">
                    <i class="material-icons">local_mall</i> Konsument-Modus
                </div>
            </a>
            <a href="javascript:" style={{ display: isDriver ? 'none' : 'block' }} onclick={() => {
                this.onDriverSwitch();
            }}>
                <div class="material-align-middle">
                    <i class="material-icons">time_to_leave</i> Fahrer-Modus
                </div>
            </a>
        </fragment>
    }
}
