import { injectable, inject } from "springtype/core/di";
import { StorageService } from "./storage";
import { ref } from "springtype/core/ref";
import { MatModal } from "st-materialize";
import { st } from "springtype/core";
import { IVirtualNode } from "springtype/web/vdom/interface";
import { ModalMiddleContent } from "../component/modal-middle-content/modal-middle-content";
import { Center } from "../component/center/center";
import { tsx } from "springtype/web/vdom";
import { T } from "springtype/web/i18n/t";

export interface IVersionDescriptor {
    version: string;
}

@injectable
export class UpdateService extends st.component {

    static readonly APP_VERSION = 'app_version';

    @ref
    modal: MatModal;

    @inject(StorageService)
    storageService: StorageService;

    currentVersion: string;

    constructor() {

        super();
        this.checkForUpdate();

        setInterval(() => {
            this.update();
        }, 60 * 60 * 1000); // check for updates every hour
    }

    private installCacheUpdater() {

        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/static/sw-cache-updater.js');
        }
    }

    getInstalledVersion(): string {
        return this.storageService.get(UpdateService.APP_VERSION);
    }

    async checkForUpdate() {

        const versionDescriptor: IVersionDescriptor = await (await fetch('/static/version.json')).json();
        this.currentVersion = versionDescriptor.version;

        //console.log('current version', this.currentVersion, 'vs version installed', this.getInstalledVersion());

        if (this.currentVersion !== this.getInstalledVersion() && this.currentVersion !== null) {
            this.showUpdatePrompt();
        }
    }

    update() {
        this.installCacheUpdater();
        this.updateInstalledVersion(this.currentVersion);

        setTimeout(() => {
            document.location.reload();
        }, 100);
    }

    updateInstalledVersion(currentVersion: string) {
        this.storageService.set(UpdateService.APP_VERSION, currentVersion);
    }


    showUpdatePrompt() {

        const modalContainer = document.createElement('DIV');
        document.body.appendChild(modalContainer)
        st.render(this.renderUpdatePrompt(), modalContainer);

        setImmediate(() => {
            // two button rows
            (this.modal.el.querySelector('.modal-footer') as HTMLElement)!.style.height = '135px';
            this.modal.toggle();
        });
    }

    renderUpdatePrompt(): IVirtualNode {
        return <MatModal ref={{ modal: this }}>

            <ModalMiddleContent>
                <Center>
                    <img style={{ width: '25vw', maxWidth: '100px' }} src={require("../../assets/images/logo_white_transparent.png")} />

                    <br /><br />
                    <br /><br />

                    <T tag="h4" class={'center'}>App Update</T>

                    <T tag="p">A new version has been released. Do you want to update?</T>
                </Center>
            </ModalMiddleContent>

            <template slot={MatModal.MAT_MODAL_FOOTER_SLOT_NAME}>
                <Center>
                    <T tag="a" href="javascript:" onclick={() => {
                        this.update()
                    }} class="modal-close waves-effect waves-green btn-flat btn-full-width">Update</T>
                    <T tag="a" href="javascript:" onclick={() => {
                        this.modal.setVisible(false)
                    }} class="modal-close waves-effect waves-green btn-flat btn-full-width">Dismiss</T>
                </Center>
            </template>
        </MatModal>
    }
}