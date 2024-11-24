import type { HttpResponsePresenterType } from "./types/httpResponsePresenterType";
import { HttpResponseStatuses } from "./utils/httpResponseStatuses/httpResponseStatuses";

export type HttpResponse<T> = HttpResponsePresenterType<T>;

class HttpResponsePresenter {
	badRequest<T>(data: T): HttpResponsePresenterType<typeof data> {
		return {
			status: HttpResponseStatuses.badRequest,
			body: data,
		};
	}

	ok<T>(data: T): HttpResponsePresenterType<typeof data> {
		return {
			status: HttpResponseStatuses.ok,
			body: data,
		};
	}
}

export const httpResponsePresenter = new HttpResponsePresenter();
