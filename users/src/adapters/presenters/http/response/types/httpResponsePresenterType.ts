import type { HttpResponseStatuses } from "../utils/httpResponseStatuses/httpResponseStatuses";

export interface HttpResponsePresenterType<T> {
	body: T;
	status: HttpResponseStatuses;
}
