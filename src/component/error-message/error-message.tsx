import { st } from "springtype/core";
import { component, attr } from "springtype/web/component";
import { tsx } from "springtype/web/vdom";
import { ref } from "springtype/core/ref";
import "./error-message.tss.scss";

interface ErrorMessageAttrs {
  message?: string;
}

@component
export class ErrorMessage extends st.component<ErrorMessageAttrs> {

  @attr
  message: string;

  @ref
  messageRef: HTMLElement;

  setMessage(message: string) {
    this.renderPartial(message, this.messageRef);
  }

  render() {
    return this.message ? (
      <p ref={{ messageRef: this }}>{this.message}</p>
    ) : (
      <fragment />
    );
  }
}
