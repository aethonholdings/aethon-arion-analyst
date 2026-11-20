import { SpinnerService } from "./spinner.service";

describe("SpinnerService counter", () => {
    it("hides only after every show has been matched", () => {
        const ngx = jasmine.createSpyObj("NgxSpinnerService", ["show", "hide"]);
        const spinner = new SpinnerService(ngx);
        spinner.show();
        spinner.show();
        spinner.hide();
        expect(ngx.hide).not.toHaveBeenCalled();
        spinner.hide();
        expect(ngx.hide).toHaveBeenCalledTimes(1);
        spinner.hide();
        expect(ngx.hide).toHaveBeenCalledTimes(2);
    });
});
