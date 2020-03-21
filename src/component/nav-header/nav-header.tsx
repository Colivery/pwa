import { st } from "springtype/core";
import { event } from "springtype/web/component/decorator/event";
import { component, attr } from "springtype/web/component";
import { tsx } from "springtype/web/vdom";
import "./nav-header.scss";

export interface NavHeaderProps {
    onAddButtonClick?: Function;
    showAddButton?: boolean;
    showBackButton?: boolean;
}

@component
export class NavHeader extends st.component<NavHeaderProps> {

    @event
    onAddButtonClick: MouseEvent;

    @attr
    showAddButton: boolean = false;

    @attr
    showBackButton: boolean = true;

    onLogoutClick = () => {
        window.authService.logout();
    };

    onAddClick = () => {
        this.dispatchEvent('addButtonClick');
    }

    onBackButtonClick = () => {
        window.history.back();
    }

    render() {
        return <fragment>
            <nav class="nav-extended">
                <div class="nav-wrapper">
                    <a href="javascript:" class="brand-logo">
                        <img class="nav-brand-logo" src={require('../../../static/assets/icons/favicon.png')} />
                    </a>
                    {this.showBackButton ? <a class='btn btn-flat btn-small' href='javascript:' onClick={this.onBackButtonClick}>
                        <i class="material-icons">arrow_back</i>
                    </a> : ''}
                    
                    <a class='dropdown-trigger btn btn-flat btn-small' href='javascript:' data-target='user-dropdown'><i class="material-icons">menu</i></a>

                </div>
                <div class="nav-content">
                    {this.showAddButton ? <a onClick={this.onAddClick} class="btn-floating btn-large halfway-fab waves-effect waves-light red">
                        <i class="material-icons">add</i>
                    </a> : ''}
                </div>
            </nav>

            <ul id='user-dropdown' class='dropdown-content'>
                <li><a href="javascript:"><i class="material-icons">account_circle</i> Profil</a></li>
                <li><a href="javascript:"><i class="material-icons">time_to_leave</i> Fahrer-Modus</a></li>
                <li class="divider" tabindex="-1"></li>
                <li><a href="javascript:" onClick={this.onLogoutClick}><i class="material-icons">directions_run</i> Logout</a></li>
            </ul>
        </fragment>
    }

    initDropdown() {

        console.log('asdasdINITDORP')
        M.Dropdown.init(document.querySelectorAll('.dropdown-trigger'), {
            coverTrigger: false
        });
    }

    onAfterRender() {
        console.log('INIT DropDown')
        this.initDropdown();
    }
}
