import { st } from "springtype/core";
import { component, attr } from "springtype/web/component";
import { tsx } from "springtype/web/vdom";
import * as errorMessageStyles from "./error-message.tss.scss";

interface ErrorMessageAttrs {
  message?: string;
}

@component
export class ErrorMessage extends st.component<ErrorMessageAttrs> {

  @attr
  message: string;

  render() {
    return this.message ? (
      <p class={errorMessageStyles.errorMessage}>{this.message}</p>
    ) : (
      <fragment />
    );
  }
}
