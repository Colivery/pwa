import {st} from "springtype/core";
import {event} from "springtype/web/component/decorator/event";
import {attr, component} from "springtype/web/component";
import {tsx} from "springtype/web/vdom";
import "./nav-header.scss";
import {ref} from "springtype/core/ref";
import {UserProfile} from "../../page/user-profile/user-profile";
import {inject} from "springtype/core/di";
import {PreferenceService} from "../../service/preference";
import {Profile} from "../../types/profile";

export interface NavHeaderProps {
    onAddButtonClick?: Function;
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

    @ref
    dropDownContentRef: HTMLUListElement;

    @ref
    dropDownLiRef: HTMLLIElement;

    @attr
    showAddButton: boolean = false;

    @attr
    showBackButton: boolean = false;

    @attr
    showRefreshButton: boolean = false;


    onLogoutClick = () => {
        window.authService.logout();
    };

    onAddClick = () => {
        this.dispatchEvent('addButtonClick');
    };

    onRefreshClick = () => {
        this.dispatchEvent('refreshButtonClick');
    };

    onBackButtonClick = () => {
        window.history.back();
    };

    render() {
        return <fragment>
            <nav class="nav-extended z-depth-3">
                <div class="nav-wrapper" ref={{dropDownLiRef: this}}>
                    <a href="javascript:" class="brand-logo">
                        <img class="nav-brand-logo" src={require('../../../assets/images/logo.png')}/>
                    </a>

                    <a class='dropdown-trigger btn btn-flat btn-small' onclick={() => {
                        this.toggle()
                    }} href='javascript:'><i class="material-icons">menu</i></a>

                    {this.showBackButton ?
                        <a class='btn btn-flat btn-small' href='javascript:' onClick={this.onBackButtonClick}>
                            <i class="material-icons">arrow_back</i>
                        </a> : ''}

                </div>
                <div class="nav-content">
                    {this.getButton()}
                </div>
            </nav>

            <ul class="dropdown-content" ref={{dropDownContentRef: this}} tabindex="0">
                <li><
                    a href="javascript:" onClick={this.onUserProfileClick}>
                    <i class="material-icons">account_circle</i> Mein Profil</a>
                </li>
                <li>
                    {this.getActiveMode()}
                </li>
                <li class="divider" tabindex="-1"/>
                <li>
                    <a href="javascript:" onclick={this.onLogoutClick}>
                        <i class="material-icons">directions_run</i> Ausloggen</a>
                </li>
            </ul>

        </fragment>
    }

    onUserProfileClick = () => {
        //close menu
        this.toggle();
        st.route = {
            path: UserProfile.ROUTE
        }
    };


    onModeSwitch = (profile: Profile) => {
        //close menu
        this.toggle();
        this.preferenceService.setProfile(profile);
        const route = profile + '-order-list';
        st.debug('switch mode -> route', route);
        st.route = {
            path: route
        }

    };

    toggle() {
        const boundingDropdown = this.dropDownLiRef.getBoundingClientRect();
        this.dropDownContentRef.setAttribute('style', `left: ${boundingDropdown.left}px; top:  ${boundingDropdown.bottom}px;`);
        this.dropDownContentRef.classList.toggle('show');
    }

    private getActiveMode() {
        if (this.preferenceService.getProfile() === 'driver') {
            return <a href="javascript:" onclick={() => {
                this.onModeSwitch('consumer')
            }}>
                <i class="material-icons">local_mall</i>
                Konsument-Modus
            </a>
        } else {
            return <a href="javascript:" onclick={() => {
                this.onModeSwitch('driver')
            }}>
                <i class="material-icons">time_to_leave</i>
                Fahrer-Modus
            </a>
        }
    }

    private getButton() {
        const comp = [];
        if (this.showAddButton) {
            comp.push(<a onClick={this.onAddClick}
                         class="btn-floating btn-large halfway-fab waves-effect waves-light red pulse">
                <i class="material-icons">add</i>
            </a>)
        }
        if (this.showRefreshButton) {
            comp.push(<a onClick={this.onRefreshClick}
                         class="btn-floating btn-large halfway-fab waves-effect waves-light red pulse">
                <i class="material-icons">refresh</i>
            </a>)
        }
        return comp;
    }
}
