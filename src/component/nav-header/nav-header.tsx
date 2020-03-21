import { st } from "springtype/core";
import { component } from "springtype/web/component";
import { tsx } from "springtype/web/vdom";
import "./nav-header.scss";

@component
export class NavHeader extends st.component {

    onLogoutClick = () => {
        window.authService.logout();
    };

    render() {
        return <fragment>
            <nav>
                <div class="nav-wrapper">
                    <a href="javascript:" class="brand-logo">
                        <img class="nav-brand-logo" src={require('../../../static/assets/icons/favicon.png')} />
                    </a>
                    <a class='dropdown-trigger btn btn-flat btn-small' href='javascript:' data-target='user-dropdown'><i class="material-icons">menu</i></a>
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
}
