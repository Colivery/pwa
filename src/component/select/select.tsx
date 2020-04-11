import { st } from "springtype/core";
import { component, attr } from "springtype/web/component";
import { ref } from "springtype/core/ref";
import { tsx } from "springtype/web/vdom";
import "./select.scss";

export interface SelectProps {
    onSelectionChanged?: object;
    items?: String[];
    selectedItem?: number;
}

@component
export class MySelect extends st.component<SelectProps> {

    @ref
    select: HTMLElement;

    @ref
    text: HTMLElement;

    @ref
    icon: HTMLElement;

    @ref
    popover: HTMLElement;

    @attr
    items: String[];

    @attr
    onSelectionChanged: object;

    @attr
    selectedItemKey: string;

    render() {
        var sSelectedItemKey = this.selectedItemKey || "",
            aItems = this.items || [],
            oSelectedItem = aItems.find(function (item: object) {
                return sSelectedItemKey === item.key;
            }),
            sSelectedItemName = "" || oSelectedItem && oSelectedItem.name;

        return <fragment>
            <div ref={{ select: this }}
                class="select-container"
                role="combobox"
                aria-expanded="false"
                tabindex="0"
                onclick={this.expand.bind(this)}>
                <span ref={{ text: this }} class="select-text" aria-live="polite">
                    { sSelectedItemName }
                </span>
                <span ref={{ icon: this }} class="select-icon">
                    v
                </span>
            </div>
            <div ref={{ popover: this }} class="select-popover">
                <ul role="listbox" class="select--list">
                    {
                        aItems.map(function (item : object, index : number) {
                            return <li
                                tabindex="0"
                                role="option"
                                data-key={ item.key }
                                aria-selected={sSelectedItemKey === item.key ? "true" : "false"}
                                aria-setsize={"" + aItems.length}
                                aria-posinset={"" + index}
                                class={sSelectedItemKey === item.key ? "select-item select-item-selected" : "select-item"}
                                onclick={this.itemPress.bind(this, item)}>
                                    <img src={item.icon} />
                                    <span class="select-item-text">
                                        { item.name }
                                    </span>
                                </li>
                        }.bind(this))
                    }
                </ul>
            </div>
        </fragment>
    }

    itemPress = function (item: object) {
        this.expand();

        this.text.innerHTML = item.name;

        var aListItems = this.popover.querySelectorAll("li"),
            oItem,
            sKey,
            sAriaSelected;

        for (var i = 0; i < aListItems.length; i++) {
            oItem = aListItems[i];
            sKey = oItem.getAttribute("data-key"),
            sAriaSelected = oItem.getAttribute("aria-selected");

            if (sKey === item.key && sAriaSelected !== "true") {
                oItem.classList.add("select-item-selected");
                oItem.setAttribute("aria-selected", "true");

                if (this.onSelectionChanged) {
                    this.onSelectionChanged.call(item);
                }
            } else if (sAriaSelected === "true") {
                oItem.classList.remove("select-item-selected");
                oItem.setAttribute("aria-selected", "false");
            }
        }
    }

    expand = function () {
        if (this.select) {
            this.select.classList.toggle("select-expanded");
            this.popover.classList.toggle("select-expanded");
            var oBoundingBox = this.select.getBoundingClientRect();

            this.popover.style = "top: " + oBoundingBox.bottom + "px;"
                + "left: " + oBoundingBox.left + "px;";

            // should be replaced by some icon
            if (this.icon.innerHTML === "v") {
                this.icon.innerHTML = "^";
            } else {
                this.icon.innerHTML = "v";
            }
        }
    };
}
