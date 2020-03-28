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

export interface NavHeaderProps {
    onAddButtonClick?: Function;
    onRefreshButtonClick?: Function;
    showAddButton?: boolean;
    showBackButton?: boolean;
    showRefreshButton?: boolean;
}

@component
export class NavHeader extends st.component<NavHeaderProps> {

    @inject(PreferenceService)
    preferenceService: PreferenceService;

    @event
    onAddButtonClick: MouseEvent;

    @event
    onRefreshButtonClick: MouseEvent;

    @ref
    dropDownContentRef: HTMLUListElement;

    @ref
    dropDownLiRef: HTMLLIElement;

    @ref
    menuIcon: HTMLElement;

    @ref
    menuOverlay: HTMLElement;

    @attr
    showAddButton: boolean = false;

    @attr
    showBackButton: boolean = true;

    @attr
    showRefreshButton: boolean = false;

    onLogoutClick = () => {
        console.log('logout click');
        window.authService.logout();
    };

    onAddClick = () => {
        this.dispatchEvent('addButtonClick');
    };

    onRefreshClick = () => {
        this.dispatchEvent('refreshButtonClick');
    };

    onBackButtonClick = () => {
        console.log('back click');
        window.history.back();
    };

    toggleMenu = () => {

        if (this.menuIcon.classList.contains('open')) {
            setTimeout(() => {
                document.body.style.overflow = 'inherit';
            }, 200 /* wait for animation to finish*/);
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
                <div class="nav-content">
                    {this.renderActionButton()}
                </div>
            </nav>

            <div class="menu-overlay" ref={{ menuOverlay: this }}>
                <a href="javascript:" onClick={() => {
                    this.onUserProfileClick()
                }}>
                    <i class="material-icons">account_circle</i> <span>Mein Profil</span></a>
                {this.getActiveMode()}

                <a href="javascript:"><i class="material-icons">description</i> <span>AGB</span></a>

                <a href="javascript:"> <i class="material-icons">security</i> <span>Datenschutz</span></a>

                <a href="javascript:" onclick={() => {
                    this.onLogoutClick()
                }}>
                    <i class="material-icons">directions_run</i> <span>Ausloggen</span></a>
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
                <i class="material-icons">local_mall</i> Konsument-Modus
            </a>
            <a href="javascript:" style={{ display: isDriver ? 'none' : 'block' }} onclick={() => {
                this.onDriverSwitch();
            }}>
                <i class="material-icons">time_to_leave</i> Fahrer-Modus
            </a>
        </fragment>
    }

    private renderActionButton() {
        return <fragment><a onClick={this.onAddClick} style={{ display: this.showAddButton ? 'block' : 'none' }}
            class="action-button btn-floating btn-large halfway-fab waves-effect waves-light red pulse">
            <i class="material-icons">add</i>
        </a>
        </fragment>
    }
}
