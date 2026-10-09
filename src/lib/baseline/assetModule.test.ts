import { expect, it } from "vitest";
import { isPureAssetMetadataModule } from "./assetModule";

const source = { version: 1, url: "/__l5e/assets-v1/image.avif", size: 123 };
const data =
  'const u="/__l5e/assets-v1/image.avif",s={version:1,url:u,size:123};export{s as _};';
it("verifies generated asset data even when its source map is empty", () => {
  expect(isPureAssetMetadataModule(data, source)).toBe(true);
});
it("rejects metadata that does not match the source file", () => {
  expect(
    isPureAssetMetadataModule(data.replace("size:123", "size:456"), source),
  ).toBe(false);
});
it.each([
  `import "recharts";${data}`,
  `${data}eval("hidden code");`,
  'const s=(()=>({version:1,url:"/__l5e/assets-v1/image.avif",size:123}))();export{s as _};',
  'const s={get version(){return 1},url:"/__l5e/assets-v1/image.avif",size:123};export{s as _};',
  `${data}export{u};`,
])("refuses executable or unaccounted exports in a mapless chunk", (code) => {
  expect(isPureAssetMetadataModule(code, source)).toBe(false);
});
