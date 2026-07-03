import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  type LucideIcon,
  ArrowLeft,
  BookOpen,
  BoxSelect,
  Brush,
  Circle,
  Command,
  Download,
  Eraser,
  Film,
  Grid3x3,
  Keyboard,
  Layers,
  Maximize,
  Minus,
  Move,
  PaintBucket,
  Palette,
  Pipette,
  Search,
  Save,
  Sparkles,
  Square,
  Wand2,
  Zap,
} from "lucide-react";

export const Route = createFileRoute("/guide")({
  component: GuidePage,
});

const pixelFont = { fontFamily: "'Press Start 2P', monospace" };

type Language = "vi" | "en";

type GuideItem = {
  title: string;
  shortcut?: string;
  purpose: string;
  steps: string[];
  tips?: string[];
};

type GuideSection = {
  id: string;
  title: string;
  subtitle: string;
  icon: LucideIcon;
  color: string;
  summary: string;
  items: GuideItem[];
};

type GuideCopy = {
  title: string;
  intro: string;
  back: string;
  openStudio: string;
  searchPlaceholder: string;
  contents: string;
  guideLabel: string;
  searchTitle: (query: string) => string;
  searchSummary: (count: number) => string;
  emptyTitle: string;
  emptyBody: string;
  purposeLabel: string;
  stepsLabel: string;
  tipsLabel: string;
  defaultTip: string;
  sections: GuideSection[];
};

const copy: Record<Language, GuideCopy> = {
  vi: {
    title: "Hướng Dẫn Sử Dụng Pixora",
    intro:
      "Tài liệu chi tiết cho từng công cụ, từng chức năng và các quy trình làm pixel art trong Pixora Studio.",
    back: "Về Studio",
    openStudio: "Mở Studio",
    searchPlaceholder: "Tìm công cụ, layer, GIF, autosave...",
    contents: "Nội dung",
    guideLabel: "Pixora Guide",
    searchTitle: (query) => `Tìm kiếm: "${query}"`,
    searchSummary: (count) => `${count} mục phù hợp với từ khóa của bạn.`,
    emptyTitle: "Không tìm thấy nội dung",
    emptyBody: "Thử tìm bằng từ khóa khác như brush, layer, gif, autosave, palette.",
    purposeLabel: "Công dụng",
    stepsLabel: "Cách sử dụng",
    tipsLabel: "Mẹo / lưu ý",
    defaultTip:
      "Nếu thao tác không đúng như mong đợi, hãy kiểm tra layer đang chọn, mask Magic Wand, tag animation đang bật và trạng thái autosave.",
    sections: [
      {
        id: "quickstart",
        title: "Bắt Đầu Nhanh",
        subtitle: "Tạo project và vẽ nét đầu tiên",
        icon: Zap,
        color: "#facc15",
        summary:
          "Các bước cơ bản để mở Studio, chọn màu, vẽ pixel, hoàn tác và lưu project an toàn.",
        items: [
          {
            title: "Mở Studio",
            purpose: "Vào màn hình vẽ chính của Pixora.",
            steps: [
              "Bấm nút Mở Studio ở góc trên hoặc quay lại trang chủ rồi chọn Launch Studio.",
              "Studio mặc định tạo canvas 32 x 32, một frame và một layer.",
              "Nếu trình duyệt có bản autosave cũ, Pixora sẽ hỏi bạn muốn khôi phục hay bỏ qua.",
            ],
            tips: ["Canvas 32 x 32 rất phù hợp để tập vẽ icon, item game và sprite nhỏ."],
          },
          {
            title: "Chọn màu chính và màu phụ",
            purpose: "Thiết lập màu trước khi vẽ.",
            steps: [
              "Click trái vào một ô màu trong Palette để chọn màu chính.",
              "Click phải vào một ô màu để chọn màu phụ.",
              "Click vào ô màu lớn ở thanh công cụ để mở bộ chọn màu của trình duyệt.",
            ],
            tips: ["Màu phụ hữu ích khi bạn cần đổi màu nhanh hoặc dùng pattern dither."],
          },
          {
            title: "Vẽ pixel đầu tiên",
            shortcut: "B",
            purpose: "Dùng Brush để đặt pixel lên layer hiện tại.",
            steps: [
              "Chọn Brush ở thanh công cụ bên trái hoặc nhấn B.",
              "Click để đặt một pixel, hoặc giữ chuột và kéo để vẽ đường liên tục.",
              "Tăng Brush Size nếu cần vẽ nét lớn hơn.",
            ],
            tips: ["Nhấn Ctrl+Z để hoàn tác và Ctrl+Y hoặc Ctrl+Shift+Z để làm lại."],
          },
          {
            title: "Lưu project",
            purpose: "Tạo file lưu thật để có thể mở lại sau này.",
            steps: [
              "Mở menu File trên thanh trên cùng.",
              "Chọn Save Project để tải file pixora-project.json.",
              "File JSON lưu đầy đủ canvas, frames, layers, palette và animation tags.",
            ],
            tips: [
              "Autosave chỉ là bản nháp trong trình duyệt. Save Project mới là bản sao lưu nên giữ.",
            ],
          },
        ],
      },
      {
        id: "interface",
        title: "Giao Diện Studio",
        subtitle: "Hiểu từng khu vực trên màn hình",
        icon: Maximize,
        color: "#38bdf8",
        summary:
          "Giải thích header, toolbar, canvas, panel bên phải, timeline và status bar để người mới không bị lạc.",
        items: [
          {
            title: "Header trên cùng",
            purpose:
              "Khu vực chứa File, Export, View, Undo, Redo, Command Palette và trạng thái project.",
            steps: [
              "File dùng để tạo project mới, lưu JSON, mở JSON và xóa autosave.",
              "Export dùng để xuất PNG, Sprite Sheet, GIF, WebM hoặc ghi màn hình canvas.",
              "Nút dấu hỏi cạnh Pixora Studio mở trang hướng dẫn này.",
              "Góc phải hiển thị kích thước canvas, số frame, mức zoom và tọa độ X/Y.",
            ],
          },
          {
            title: "Thanh công cụ bên trái",
            purpose: "Chọn công cụ vẽ và màu đang sử dụng.",
            steps: [
              "Mỗi biểu tượng là một công cụ như Brush, Eraser, Fill, Selection hoặc Magic Wand.",
              "Đưa chuột lên biểu tượng để xem tên công cụ và phím tắt.",
              "Hai ô màu cuối thanh là màu chính và màu phụ.",
            ],
          },
          {
            title: "Canvas ở giữa",
            purpose: "Vùng thao tác chính để vẽ pixel.",
            steps: [
              "Checkerboard thể hiện vùng pixel trong suốt.",
              "Grid giúp đặt pixel chính xác khi zoom lớn.",
              "Con trỏ thay đổi theo công cụ đang chọn để bạn biết mình đang ở chế độ nào.",
            ],
          },
          {
            title: "Panel bên phải",
            purpose:
              "Khu vực điều khiển canvas, preview, brush, selection, reference, palette và layers.",
            steps: [
              "Mỗi nhóm có thể mở hoặc thu gọn bằng tiêu đề của nhóm.",
              "Layers là nhóm quan trọng nhất khi bạn làm tác phẩm nhiều lớp.",
              "Palette và Reference giúp quản lý màu và ảnh tham chiếu.",
            ],
          },
          {
            title: "Timeline phía dưới",
            purpose: "Quản lý frame animation.",
            steps: [
              "Click thumbnail để chọn frame.",
              "Bấm + để thêm frame mới hoặc Duplicate để nhân đôi frame hiện tại.",
              "Nhập duration ms dưới mỗi thumbnail để điều chỉnh tốc độ frame.",
              "Click phải vào frame để mở menu thêm, nhân đôi, di chuyển hoặc xóa.",
            ],
          },
        ],
      },
      {
        id: "tools",
        title: "Bộ Công Cụ Vẽ Siêu Cấp",
        subtitle: "Chi tiết từng tool và cách dùng",
        icon: Brush,
        color: "#a855f7",
        summary:
          "Tất cả công cụ trên toolbar bên trái, gồm công dụng, phím tắt, thao tác và mẹo làm việc.",
        items: [
          {
            title: "Brush",
            shortcut: "B",
            purpose: "Vẽ pixel tự do bằng màu chính.",
            steps: [
              "Chọn Brush hoặc nhấn B.",
              "Click để vẽ một điểm, giữ chuột và kéo để vẽ đường liên tục.",
              "Dùng Brush Size để thay đổi độ dày từ 1 đến 16 pixel.",
            ],
            tips: ["Brush Size 1 cho nét pixel sạch nhất; tăng size khi tô nền hoặc phác nhanh."],
          },
          {
            title: "Dither",
            shortcut: "D",
            purpose: "Vẽ pattern caro để tạo cảm giác chuyển sắc hoặc đổ bóng.",
            steps: [
              "Chọn Dither hoặc nhấn D.",
              "Chỉnh Dither Density để tăng hoặc giảm mật độ pixel.",
              "Dùng các màu gần nhau để tạo shading mềm mà vẫn giữ phong cách pixel art.",
            ],
            tips: ["Dither rất hữu ích khi palette bị giới hạn và bạn không muốn dùng opacity."],
          },
          {
            title: "Eraser",
            shortcut: "E",
            purpose: "Xóa pixel về trạng thái trong suốt trên layer hiện tại.",
            steps: [
              "Chọn Eraser hoặc nhấn E.",
              "Click hoặc kéo trên canvas để xóa.",
              "Brush Size cũng ảnh hưởng đến vùng bị xóa.",
            ],
            tips: [
              "Nếu thấy layer bên dưới hiện ra, nghĩa là pixel ở layer hiện tại đã trở thành transparent.",
            ],
          },
          {
            title: "Fill",
            shortcut: "F",
            purpose: "Tô nhanh một vùng liên thông có cùng màu.",
            steps: [
              "Chọn Fill hoặc nhấn F.",
              "Click vào vùng cần tô.",
              "Fill chỉ lan trong các pixel liền kề có cùng màu ban đầu.",
            ],
            tips: [
              "Nếu fill không lan hết, vùng đó có thể bị chặn bởi pixel màu khác hoặc đang nằm ở layer khác.",
            ],
          },
          {
            title: "Color Picker",
            shortcut: "I",
            purpose: "Lấy màu trực tiếp từ canvas.",
            steps: [
              "Chọn Picker hoặc nhấn I.",
              "Click vào pixel có màu cần lấy.",
              "Màu lấy được sẽ trở thành màu chính.",
            ],
            tips: [
              "Picker lấy màu từ hình đã composite, nên có thể lấy kết quả sau opacity hoặc blend mode.",
            ],
          },
          {
            title: "Line",
            shortcut: "L",
            purpose: "Vẽ đường thẳng pixel sắc nét.",
            steps: [
              "Chọn Line hoặc nhấn L.",
              "Click điểm đầu, kéo đến điểm cuối rồi thả chuột.",
              "Dùng cho vũ khí, viền, tia sáng hoặc đường kiến trúc.",
            ],
          },
          {
            title: "Rectangle",
            shortcut: "R",
            purpose: "Vẽ khung hình chữ nhật.",
            steps: [
              "Chọn Rectangle hoặc nhấn R.",
              "Kéo từ một góc sang góc đối diện.",
              "Phù hợp để tạo UI, ô cửa, item, viền khung.",
            ],
          },
          {
            title: "Ellipse",
            shortcut: "C",
            purpose: "Vẽ hình tròn hoặc oval pixel.",
            steps: [
              "Chọn Ellipse hoặc nhấn C.",
              "Kéo để xác định vùng chứa hình.",
              "Thả chuột để tạo đường viền ellipse.",
            ],
            tips: ["Dùng cho mắt, bong bóng, bánh xe, coin, aura hoặc hiệu ứng tròn."],
          },
          {
            title: "Move Layer",
            shortcut: "M",
            purpose: "Di chuyển toàn bộ nội dung layer hiện tại.",
            steps: [
              "Chọn Move hoặc nhấn M.",
              "Click và kéo trên canvas để dịch pixel của layer.",
              "Chỉ layer đang active bị di chuyển; các layer khác giữ nguyên.",
            ],
          },
          {
            title: "Selection",
            shortcut: "S",
            purpose: "Tạo vùng chọn chữ nhật để copy, paste, cut hoặc xóa.",
            steps: [
              "Chọn Selection hoặc nhấn S.",
              "Kéo trên canvas để tạo khung chọn.",
              "Dùng Ctrl+C để copy, Ctrl+V để paste, Ctrl+X để cut, Delete để xóa.",
            ],
            tips: ["Paste sẽ đặt nội dung vào góc trên trái của vùng chọn hiện tại."],
          },
          {
            title: "Magic Wand",
            shortcut: "W",
            purpose: "Tạo mask từ vùng pixel liên thông cùng màu.",
            steps: [
              "Chọn Magic Wand hoặc nhấn W.",
              "Click vào vùng màu muốn chọn.",
              "Sau khi mask được tạo, Brush và Fill chỉ tác động trong mask.",
              "Bấm Clear Mask trên header để bỏ mask.",
            ],
            tips: ["Dùng Magic Wand để tô lại áo, tóc, nền mà không bị lem ra ngoài."],
          },
        ],
      },
      {
        id: "canvas",
        title: "Canvas & Hiển Thị",
        subtitle: "Zoom, pan, grid, symmetry, reference",
        icon: Grid3x3,
        color: "#06b6d4",
        summary: "Các chế độ xem và điều hướng giúp bạn vẽ chính xác hơn.",
        items: [
          {
            title: "Zoom",
            purpose: "Phóng to hoặc thu nhỏ canvas.",
            steps: [
              "Dùng slider Zoom trong panel Canvas.",
              "Zoom cao giúp đặt từng pixel chính xác.",
              "Zoom thấp giúp xem tổng thể sprite.",
            ],
          },
          {
            title: "Pan viewport",
            purpose: "Di chuyển khung nhìn khi canvas lớn.",
            steps: [
              "Giữ Space rồi kéo canvas, hoặc dùng chuột giữa nếu có.",
              "Pan chỉ di chuyển góc nhìn, không thay đổi pixel.",
            ],
          },
          {
            title: "Grid",
            shortcut: "G",
            purpose: "Bật hoặc tắt lưới pixel.",
            steps: [
              "Nhấn G hoặc bấm nút Grid.",
              "Grid hiển thị rõ khi zoom đủ lớn.",
              "Bật Grid khi vẽ outline, tắt Grid khi xem tổng thể.",
            ],
          },
          {
            title: "Mirror X / Mirror Y / Sym 4",
            purpose: "Vẽ đối xứng để tạo sprite nhanh.",
            steps: [
              "Mirror X tạo nét đối xứng trái phải.",
              "Mirror Y tạo nét đối xứng trên dưới.",
              "Sym 4 vẽ theo bốn hướng, phù hợp cho icon, vật phẩm hoặc pattern đối xứng.",
            ],
            tips: ["Bật đối xứng khi dựng hình chính, tắt khi thêm chi tiết tự nhiên."],
          },
          {
            title: "Reference Image",
            purpose: "Đặt ảnh tham chiếu lên canvas.",
            steps: [
              "Trong panel Reference, chọn Load image.",
              "Chỉnh Opacity để ảnh mờ hơn hoặc rõ hơn.",
              "Dùng Show để tạm ẩn hoặc hiện ảnh.",
              "Dùng Extract palette để lấy bảng màu từ ảnh.",
            ],
          },
          {
            title: "Tile Preview",
            shortcut: "T",
            purpose: "Xem canvas lặp 3 x 3 để kiểm tra tile seamless.",
            steps: [
              "Bật Tile Preview trong panel Brush hoặc nhấn T.",
              "Quan sát mép trái phải và trên dưới có khớp nhau không.",
              "Dùng cho texture nền, gạch, cỏ, nước hoặc pattern game.",
            ],
          },
        ],
      },
      {
        id: "layers",
        title: "Layers & Effects",
        subtitle: "Quản lý lớp vẽ và hiệu ứng nhanh",
        icon: Layers,
        color: "#22c55e",
        summary:
          "Layers giúp tách line, màu, bóng, highlight và background để sửa mà không phá hỏng art.",
        items: [
          {
            title: "Thêm / nhân đôi / xóa layer",
            purpose: "Tạo cấu trúc tranh rõ ràng.",
            steps: [
              "Bấm + để thêm layer mới phía trên layer hiện tại.",
              "Bấm Duplicate để nhân đôi layer.",
              "Bấm thùng rác để xóa layer nếu project còn hơn một layer.",
            ],
            tips: ["Nên tách line art, base color, shadow và highlight thành các layer riêng."],
          },
          {
            title: "Ẩn hiện và đổi tên layer",
            purpose: "Làm việc có tổ chức khi có nhiều layer.",
            steps: [
              "Click icon mắt để ẩn hoặc hiện layer.",
              "Click vào tên layer để đổi tên.",
              "Click vào hàng layer để chọn layer active.",
            ],
          },
          {
            title: "Opacity",
            purpose: "Làm layer trong suốt một phần.",
            steps: [
              "Kéo slider Opacity từ 0% đến 100%.",
              "Opacity ảnh hưởng đến hiển thị và export.",
              "Dùng opacity thấp cho sketch, shadow hoặc reference tạm.",
            ],
          },
          {
            title: "Blend mode",
            purpose: "Hòa trộn màu giữa các layer.",
            steps: [
              "Normal hiển thị layer bình thường.",
              "Multiply làm tối, phù hợp cho shadow.",
              "Screen và Lighten làm sáng, phù hợp cho glow.",
              "Overlay và Color Dodge tạo highlight mạnh.",
            ],
          },
          {
            title: "Flip / Rotate",
            purpose: "Biến đổi layer nhanh.",
            steps: [
              "Flip H lật ngang layer.",
              "Flip V lật dọc layer.",
              "Rotate xoay layer 90 độ.",
              "Các thao tác này chỉ tác động layer active.",
            ],
          },
          {
            title: "Outline / Grayscale / Invert / Hue Shift",
            purpose: "Thêm hiệu ứng nhanh cho layer active.",
            steps: [
              "Outline thêm viền 1 pixel quanh vùng có màu.",
              "Grayscale đổi layer sang trắng đen.",
              "Invert đảo ngược màu.",
              "Hue Shift xoay tông màu theo góc màu.",
            ],
          },
        ],
      },
      {
        id: "palette",
        title: "Màu & Palette",
        subtitle: "Swatch, preset, ramp, harmony",
        icon: Palette,
        color: "#ec4899",
        summary: "Quản lý màu chính, màu phụ, preset, import/export palette và tạo màu mới.",
        items: [
          {
            title: "Primary / Secondary color",
            purpose: "Chọn hai màu thao tác nhanh.",
            steps: [
              "Click trái swatch để chọn Primary.",
              "Click phải swatch để chọn Secondary.",
              "Primary dùng cho hầu hết công cụ; Secondary dùng khi click phải hoặc cần đổi màu nhanh.",
            ],
          },
          {
            title: "Palette presets",
            purpose: "Dùng bộ màu có sẵn.",
            steps: [
              "Mở dropdown Load preset trong panel Palette.",
              "Chọn PICO-8, Game Boy, NES, Sweetie 16 hoặc Endesga 16.",
              "Preset sẽ thay palette hiện tại của project.",
            ],
          },
          {
            title: "Add / Delete / Sort",
            purpose: "Chỉnh sửa danh sách swatch.",
            steps: [
              "Add current thêm màu primary vào palette.",
              "Del xóa swatch đang chọn.",
              "Sort hue sắp xếp theo vòng màu.",
              "Sort lum sắp xếp theo độ sáng.",
            ],
          },
          {
            title: "Ramp generator",
            purpose: "Tạo dải màu từ shadow đến highlight.",
            steps: [
              "Chọn màu đầu và màu cuối.",
              "Nhập số bước ramp.",
              "Bấm Add để thêm các màu trung gian vào palette.",
            ],
            tips: ["Ramp 4-6 màu là nền tốt để shading sprite nhỏ."],
          },
          {
            title: "Color harmony",
            purpose: "Tạo màu phù hợp với màu hiện tại.",
            steps: [
              "Complement tạo màu đối diện trên vòng màu.",
              "Analogous tạo hai màu gần màu hiện tại.",
              "Triadic tạo bộ ba màu cân bằng.",
            ],
          },
          {
            title: "Import / Export palette",
            purpose: "Chia sẻ và tải lại bảng màu.",
            steps: [
              "Bấm mũi tên xuống để export palette JSON.",
              "Bấm mũi tên lên để import palette JSON.",
              "Palette JSON là danh sách các mã hex.",
            ],
          },
        ],
      },
      {
        id: "animation",
        title: "Animation",
        subtitle: "Frames, timing, preview, tags",
        icon: Film,
        color: "#f59e0b",
        summary:
          "Tạo animation bằng timeline, frame duration, onion skin và tag để export từng đoạn.",
        items: [
          {
            title: "Frame timeline",
            purpose: "Quản lý chuỗi frame animation.",
            steps: [
              "Mỗi thumbnail đại diện cho một frame.",
              "Click thumbnail để chọn frame đang vẽ.",
              "Bấm Play để chạy animation.",
            ],
          },
          {
            title: "Thêm / nhân đôi / xóa frame",
            purpose: "Tạo chuyển động từ nhiều frame.",
            steps: [
              "Bấm + để thêm frame mới sau frame hiện tại.",
              "Bấm Duplicate để copy frame hiện tại.",
              "Bấm Delete để xóa frame nếu còn hơn một frame.",
            ],
            tips: ["Workflow tốt: duplicate frame, sửa nhẹ, rồi play để xem."],
          },
          {
            title: "Duration ms",
            purpose: "Điều khiển tốc độ từng frame.",
            steps: [
              "Nhập số milliseconds bên dưới thumbnail.",
              "Giá trị nhỏ hơn chạy nhanh hơn.",
              "Giá trị lớn hơn tạo cảm giác dừng hoặc hit-pause.",
            ],
          },
          {
            title: "Onion skin",
            purpose: "Xem frame trước/sau để vẽ chuyển động mượt.",
            steps: [
              "Bật Onion trong panel Canvas.",
              "Mode Normal hiển thị ghost frame.",
              "Mode Pro tint frame trước màu đỏ và frame sau màu xanh.",
            ],
          },
          {
            title: "Animation Tags",
            purpose: "Chia animation thành Idle, Run, Jump, Attack.",
            steps: [
              "Trong Animation Preview, bấm Add Tag.",
              "Đặt tên tag và chỉnh From/To frame.",
              "Click tag để active.",
              "Khi active, playback và export chỉ dùng frame trong tag.",
            ],
          },
        ],
      },
      {
        id: "files",
        title: "File, Autosave & Recovery",
        subtitle: "Lưu, mở, khôi phục, migrate file cũ",
        icon: Save,
        color: "#facc15",
        summary: "Pixora có autosave để an toàn hơn, nhưng Save Project vẫn là cách backup chính.",
        items: [
          {
            title: "Autosave",
            purpose: "Tự động lưu bản nháp vào localStorage.",
            steps: [
              "Sau khi project thay đổi, Pixora đợi 1.5 giây rồi lưu.",
              "Pixel data được nén RLE để giảm dung lượng.",
              "Autosave lưu trên trình duyệt hiện tại, không đồng bộ lên cloud.",
            ],
          },
          {
            title: "Restore Modal",
            purpose: "Khôi phục phiên làm việc cũ.",
            steps: [
              "Khi mở Studio và có autosave, modal Unsaved Session Found sẽ hiện.",
              "Modal cho biết kích thước canvas, số frame và thời gian lưu.",
              "Bấm Restore để tiếp tục hoặc Discard để bỏ bản nháp.",
            ],
          },
          {
            title: "Save Project",
            purpose: "Tải file JSON về máy.",
            steps: [
              "Mở File > Save Project.",
              "File tải về có tên pixora-project.json.",
              "Nên giữ file này nếu muốn backup hoặc chuyển sang máy khác.",
            ],
          },
          {
            title: "Open JSON",
            purpose: "Mở lại project Pixora hoặc file cũ từ PixelForge.",
            steps: [
              "Mở File > Open JSON.",
              "Chọn file .json.",
              "Project cũ sẽ được migrate về schema Pixora hiện tại.",
            ],
          },
          {
            title: "Clear Autosave",
            purpose: "Xóa bản nháp trong trình duyệt.",
            steps: [
              "Mở File > Clear Autosave.",
              "Hoặc mở Command Palette và tìm Clear autosave.",
              "Nên dùng khi bạn đã lưu JSON và muốn xóa session cũ.",
            ],
          },
        ],
      },
      {
        id: "export",
        title: "Export",
        subtitle: "PNG, Sprite Sheet, GIF, WebM",
        icon: Download,
        color: "#3b82f6",
        summary:
          "Xuất tác phẩm ra ảnh tĩnh, sprite sheet cho game, GIF để chia sẻ hoặc video WebM.",
        items: [
          {
            title: "Export Scale",
            purpose: "Phóng to pixel art khi xuất file.",
            steps: [
              "Trong menu Export, chỉnh Scale từ 1 đến 32.",
              "Canvas 32 x 32 với scale 8 sẽ thành ảnh 256 x 256.",
              "Image smoothing tắt nên pixel vẫn sắc nét.",
            ],
            tips: ["Scale 8 hoặc 16 thường đẹp khi đăng lên web hoặc mạng xã hội."],
          },
          {
            title: "Export PNG",
            purpose: "Xuất frame hiện tại thành ảnh PNG.",
            steps: [
              "Chọn frame muốn xuất.",
              "Mở Export > Export PNG.",
              "File tải về có tên pixora-frame-N.png.",
            ],
          },
          {
            title: "Export Sprite Sheet",
            purpose: "Nối nhiều frame thành một ảnh ngang cho game engine.",
            steps: [
              "Mở Export > Export Sprite Sheet.",
              "Tất cả frame hoặc frame trong tag active sẽ được ghép ngang.",
              "Dùng trong Unity, Godot, Phaser hoặc engine riêng.",
            ],
          },
          {
            title: "Export GIF",
            purpose: "Tạo animation để chia sẻ nhanh.",
            steps: [
              "Mở Export > Export GIF.",
              "GIF tôn trọng duration ms của từng frame.",
              "Nếu tag active, chỉ export frame trong tag.",
            ],
          },
          {
            title: "Export WebM",
            purpose: "Tạo video nhẹ và mượt hơn GIF.",
            steps: [
              "Mở Export > Export Video (WebM).",
              "Pixora render animation vào canvas và ghi WebM.",
              "Phù hợp để đăng demo lên web hoặc social.",
            ],
          },
        ],
      },
      {
        id: "shortcuts",
        title: "Phím Tắt & Command Palette",
        subtitle: "Làm việc nhanh hơn bằng bàn phím",
        icon: Keyboard,
        color: "#14b8a6",
        summary: "Danh sách phím tắt quan trọng và cách dùng Ctrl+K để tìm mọi lệnh trong Studio.",
        items: [
          {
            title: "Phím tắt công cụ",
            purpose: "Đổi tool mà không cần rời tay khỏi bàn phím.",
            steps: [
              "B Brush, D Dither, E Eraser, F Fill, I Picker.",
              "L Line, R Rectangle, C Ellipse.",
              "S Selection, W Magic Wand, M Move.",
            ],
          },
          {
            title: "Phím tắt chỉnh sửa",
            purpose: "Thao tác với lịch sử và selection.",
            steps: [
              "Ctrl+Z để undo.",
              "Ctrl+Y hoặc Ctrl+Shift+Z để redo.",
              "Ctrl+C copy selection, Ctrl+V paste, Ctrl+X cut.",
              "Delete xóa selection, Esc đóng modal hoặc bỏ selection.",
            ],
          },
          {
            title: "Command Palette",
            shortcut: "Ctrl+K / Cmd+K",
            purpose: "Tìm và chạy lệnh bằng tên.",
            steps: [
              "Nhấn Ctrl+K trên Windows/Linux hoặc Cmd+K trên Mac.",
              "Gõ tên lệnh như resize, export png, gif, outline, grayscale.",
              "Dùng phím lên/xuống để chọn, Enter để chạy.",
            ],
            tips: ["Nếu không nhớ một tính năng nằm ở đâu, hãy mở Command Palette trước."],
          },
        ],
      },
      {
        id: "workflows",
        title: "Workflow Mẫu",
        subtitle: "Quy trình thực tế cho sprite và tile",
        icon: Sparkles,
        color: "#fb7185",
        summary:
          "Các quy trình mẫu để tạo sprite nhân vật, item, animation idle/run và tile seamless.",
        items: [
          {
            title: "Sprite nhân vật 32 x 32",
            purpose: "Làm character sprite có layer rõ ràng.",
            steps: [
              "Tạo canvas 32 x 32.",
              "Layer 1: sketch hoặc shape tổng thể.",
              "Layer 2: line art.",
              "Layer 3: base color.",
              "Layer 4: shadow và highlight.",
            ],
          },
          {
            title: "Item hoặc icon game",
            purpose: "Tạo vật phẩm nhỏ nhưng đọc rõ trong game.",
            steps: [
              "Dùng Sym 4 hoặc Mirror X nếu item đối xứng.",
              "Dùng Outline màu tối để item nổi trên nền.",
              "Export PNG scale 8 hoặc 16.",
            ],
          },
          {
            title: "Animation Idle",
            purpose: "Tạo chuyển động nhẹ cho nhân vật.",
            steps: [
              "Vẽ frame đầu.",
              "Duplicate thành 3-4 frame.",
              "Dịch đầu, tay hoặc áo lên xuống 1 pixel.",
              "Đặt duration 140-220ms.",
              "Tạo tag Idle để export riêng.",
            ],
          },
          {
            title: "Tile seamless",
            purpose: "Tạo texture lặp không lộ vết nối.",
            steps: [
              "Bật Tile Preview.",
              "Vẽ chi tiết chạy qua mép trái/phải và trên/dưới.",
              "Kiểm tra vùng nối trong preview 3 x 3.",
              "Export PNG scale 1 nếu dùng trực tiếp trong game engine.",
            ],
          },
        ],
      },
    ],
  },
  en: {
    title: "Pixora User Guide",
    intro:
      "A detailed manual for every tool, feature, export option, and pixel-art workflow inside Pixora Studio.",
    back: "Back to Studio",
    openStudio: "Open Studio",
    searchPlaceholder: "Search tools, layers, GIF, autosave...",
    contents: "Contents",
    guideLabel: "Pixora Guide",
    searchTitle: (query) => `Search: "${query}"`,
    searchSummary: (count) => `${count} matching entries found.`,
    emptyTitle: "No results found",
    emptyBody: "Try another keyword such as brush, layer, gif, autosave, or palette.",
    purposeLabel: "Purpose",
    stepsLabel: "How to use",
    tipsLabel: "Tips / notes",
    defaultTip:
      "If something behaves differently than expected, check the active layer, Magic Wand mask, active animation tag, and autosave state.",
    sections: [
      {
        id: "quickstart",
        title: "Quick Start",
        subtitle: "Create a project and draw your first pixels",
        icon: Zap,
        color: "#facc15",
        summary:
          "The essential flow for opening Studio, choosing colors, drawing pixels, undoing edits, and saving safely.",
        items: [
          {
            title: "Open Studio",
            purpose: "Enter Pixora's main drawing workspace.",
            steps: [
              "Click Open Studio at the top, or return to the landing page and choose Launch Studio.",
              "Studio starts with a 32 x 32 canvas, one frame, and one layer.",
              "If a previous autosave exists, Pixora asks whether you want to restore or discard it.",
            ],
            tips: ["A 32 x 32 canvas is ideal for icons, game items, and small character sprites."],
          },
          {
            title: "Choose primary and secondary colors",
            purpose: "Prepare your drawing colors before painting.",
            steps: [
              "Left-click a palette swatch to set the primary color.",
              "Right-click a swatch to set the secondary color.",
              "Click the large color boxes in the toolbar to open the browser color picker.",
            ],
            tips: ["The secondary color is useful for quick swaps and dithering workflows."],
          },
          {
            title: "Draw your first pixel",
            shortcut: "B",
            purpose: "Use Brush to place pixels on the active layer.",
            steps: [
              "Select Brush from the left toolbar or press B.",
              "Click to place one pixel, or drag to draw a continuous stroke.",
              "Increase Brush Size when you need a thicker stroke.",
            ],
            tips: ["Press Ctrl+Z to undo and Ctrl+Y or Ctrl+Shift+Z to redo."],
          },
          {
            title: "Save your project",
            purpose: "Download a real project file you can open later.",
            steps: [
              "Open the File menu in the top bar.",
              "Choose Save Project to download pixora-project.json.",
              "The JSON file stores canvas size, frames, layers, palette, and animation tags.",
            ],
            tips: ["Autosave is only a browser draft. Save Project is the file you should keep."],
          },
        ],
      },
      {
        id: "interface",
        title: "Studio Interface",
        subtitle: "Understand every area of the screen",
        icon: Maximize,
        color: "#38bdf8",
        summary:
          "A map of the top bar, toolbar, canvas, right panels, timeline, and status readouts.",
        items: [
          {
            title: "Top bar",
            purpose: "Holds File, Export, View, Undo, Redo, Command Palette, and project status.",
            steps: [
              "File creates projects, saves JSON, opens JSON, and clears autosave.",
              "Export outputs PNG, Sprite Sheet, GIF, WebM, or canvas recordings.",
              "The question-mark button next to Pixora Studio opens this guide.",
              "The right side shows canvas size, frame count, zoom, and X/Y coordinates.",
            ],
          },
          {
            title: "Left toolbar",
            purpose: "Select drawing tools and active colors.",
            steps: [
              "Each icon is a tool such as Brush, Eraser, Fill, Selection, or Magic Wand.",
              "Hover an icon to see its tool name and shortcut.",
              "The two color boxes near the bottom are primary and secondary colors.",
            ],
          },
          {
            title: "Center canvas",
            purpose: "The main pixel editing surface.",
            steps: [
              "The checkerboard shows transparent pixels.",
              "The grid helps you place pixels accurately at high zoom.",
              "The cursor changes depending on the selected tool.",
            ],
          },
          {
            title: "Right panels",
            purpose:
              "Control canvas settings, preview, brush, selection, references, palette, and layers.",
            steps: [
              "Each panel group can be collapsed or expanded by clicking its title.",
              "Layers is the key panel for complex artwork.",
              "Palette and Reference help you manage colors and source images.",
            ],
          },
          {
            title: "Bottom timeline",
            purpose: "Manage animation frames.",
            steps: [
              "Click a thumbnail to select a frame.",
              "Use + to add a frame or Duplicate to copy the current frame.",
              "Edit duration in milliseconds under each thumbnail.",
              "Right-click a frame to add, duplicate, move, or delete it.",
            ],
          },
        ],
      },
      {
        id: "tools",
        title: "11 Drawing Tools",
        subtitle: "Every tool and when to use it",
        icon: Brush,
        color: "#a855f7",
        summary:
          "All toolbar tools with their purpose, shortcut, interaction model, and practical tips.",
        items: [
          {
            title: "Brush",
            shortcut: "B",
            purpose: "Freehand pixel drawing with the primary color.",
            steps: [
              "Select Brush or press B.",
              "Click for a single point, or drag to draw a continuous stroke.",
              "Use Brush Size to paint from 1 to 16 pixels wide.",
            ],
            tips: [
              "Brush Size 1 gives the cleanest pixel-art line; larger sizes are useful for blocking areas.",
            ],
          },
          {
            title: "Dither",
            shortcut: "D",
            purpose: "Paint a checker pattern for shading and color transitions.",
            steps: [
              "Select Dither or press D.",
              "Adjust Dither Density to control how much of the pattern is filled.",
              "Use nearby colors for smoother pixel-art shading.",
            ],
            tips: ["Dither is useful when your palette is limited and you want to avoid opacity."],
          },
          {
            title: "Eraser",
            shortcut: "E",
            purpose: "Clear pixels to transparency on the active layer.",
            steps: [
              "Select Eraser or press E.",
              "Click or drag on the canvas to erase.",
              "Brush Size also controls the eraser area.",
            ],
            tips: [
              "If lower layers appear after erasing, the active layer's pixels are now transparent.",
            ],
          },
          {
            title: "Fill",
            shortcut: "F",
            purpose: "Quickly fill a connected region of the same color.",
            steps: [
              "Select Fill or press F.",
              "Click the region you want to fill.",
              "Fill only spreads through connected pixels matching the starting color.",
            ],
            tips: [
              "If fill stops early, the region may be blocked by another color or drawn on another layer.",
            ],
          },
          {
            title: "Color Picker",
            shortcut: "I",
            purpose: "Sample a color directly from the canvas.",
            steps: [
              "Select Picker or press I.",
              "Click the pixel color you want to sample.",
              "The sampled color becomes your primary color.",
            ],
            tips: [
              "Picker samples the composited canvas, so opacity and blend modes can affect the color.",
            ],
          },
          {
            title: "Line",
            shortcut: "L",
            purpose: "Draw crisp pixel-perfect straight lines.",
            steps: [
              "Select Line or press L.",
              "Click the start point, drag to the end point, then release.",
              "Use it for weapons, borders, beams, and architectural edges.",
            ],
          },
          {
            title: "Rectangle",
            shortcut: "R",
            purpose: "Draw rectangular outlines.",
            steps: [
              "Select Rectangle or press R.",
              "Drag from one corner to the opposite corner.",
              "Use it for UI, doors, items, and frames.",
            ],
          },
          {
            title: "Ellipse",
            shortcut: "C",
            purpose: "Draw pixel circles and ovals.",
            steps: [
              "Select Ellipse or press C.",
              "Drag to define the bounding area.",
              "Release to commit the ellipse outline.",
            ],
            tips: ["Great for eyes, bubbles, wheels, coins, auras, and round effects."],
          },
          {
            title: "Move Layer",
            shortcut: "M",
            purpose: "Move all pixels on the active layer.",
            steps: [
              "Select Move or press M.",
              "Click and drag on the canvas to shift the layer's pixels.",
              "Only the active layer moves; other layers stay in place.",
            ],
          },
          {
            title: "Selection",
            shortcut: "S",
            purpose: "Create a rectangular region for copy, paste, cut, or delete.",
            steps: [
              "Select Selection or press S.",
              "Drag on the canvas to create a selection box.",
              "Use Ctrl+C to copy, Ctrl+V to paste, Ctrl+X to cut, and Delete to clear.",
            ],
            tips: ["Paste places content at the top-left of the current selection."],
          },
          {
            title: "Magic Wand",
            shortcut: "W",
            purpose: "Create a mask from a connected same-color region.",
            steps: [
              "Select Magic Wand or press W.",
              "Click the colored region you want to target.",
              "Brush and Fill affect only the masked area.",
              "Click Clear Mask in the header to remove the mask.",
            ],
            tips: [
              "Use Magic Wand to recolor clothes, hair, or backgrounds without painting outside the region.",
            ],
          },
        ],
      },
      {
        id: "canvas",
        title: "Canvas & View",
        subtitle: "Zoom, pan, grid, symmetry, reference",
        icon: Grid3x3,
        color: "#06b6d4",
        summary: "View and navigation modes that help you draw accurately.",
        items: [
          {
            title: "Zoom",
            purpose: "Scale the canvas view up or down.",
            steps: [
              "Use the Zoom slider in the Canvas panel.",
              "High zoom helps precise pixel placement.",
              "Low zoom helps you judge the whole sprite.",
            ],
          },
          {
            title: "Pan viewport",
            purpose: "Move the viewport when the canvas is larger than the visible area.",
            steps: [
              "Hold Space and drag the canvas, or use middle mouse if available.",
              "Panning only moves your view; it does not edit pixels.",
            ],
          },
          {
            title: "Grid",
            shortcut: "G",
            purpose: "Toggle the pixel grid.",
            steps: [
              "Press G or click the Grid control.",
              "The grid is visible when zoom is high enough.",
              "Enable grid for outlines; disable it when judging the full image.",
            ],
          },
          {
            title: "Mirror X / Mirror Y / Sym 4",
            purpose: "Draw symmetrical shapes faster.",
            steps: [
              "Mirror X mirrors strokes left and right.",
              "Mirror Y mirrors strokes vertically.",
              "Sym 4 draws in four directions, useful for icons, items, and symmetrical patterns.",
            ],
            tips: ["Turn symmetry on for the main shape, then turn it off for natural details."],
          },
          {
            title: "Reference Image",
            purpose: "Overlay a source image on the canvas.",
            steps: [
              "Choose Load image in the Reference panel.",
              "Adjust Opacity to make the reference lighter or clearer.",
              "Use Show to hide or reveal the reference.",
              "Use Extract palette to build a palette from the image.",
            ],
          },
          {
            title: "Tile Preview",
            shortcut: "T",
            purpose: "Preview the canvas repeated in a 3 x 3 grid.",
            steps: [
              "Enable Tile Preview in the Brush panel or press T.",
              "Check whether left/right and top/bottom edges connect cleanly.",
              "Use it for floor, grass, water, background, and texture patterns.",
            ],
          },
        ],
      },
      {
        id: "layers",
        title: "Layers & Effects",
        subtitle: "Layer management and quick effects",
        icon: Layers,
        color: "#22c55e",
        summary:
          "Layers let you separate line art, base color, shadows, highlights, and backgrounds.",
        items: [
          {
            title: "Add / duplicate / delete layers",
            purpose: "Build a clear artwork structure.",
            steps: [
              "Click + to add a new layer above the current one.",
              "Click Duplicate to copy the active layer.",
              "Click the trash button to delete a layer when more than one layer exists.",
            ],
            tips: ["Keep line art, base color, shadows, and highlights on separate layers."],
          },
          {
            title: "Visibility and naming",
            purpose: "Stay organized when working with many layers.",
            steps: [
              "Click the eye icon to hide or show a layer.",
              "Click the layer name to rename it.",
              "Click a layer row to make it active.",
            ],
          },
          {
            title: "Opacity",
            purpose: "Make a layer partially transparent.",
            steps: [
              "Drag the Opacity slider from 0% to 100%.",
              "Opacity affects both preview and export.",
              "Low opacity is useful for sketches, shadows, and temporary references.",
            ],
          },
          {
            title: "Blend mode",
            purpose: "Blend colors between layers.",
            steps: [
              "Normal displays the layer as-is.",
              "Multiply darkens and is useful for shadows.",
              "Screen and Lighten brighten and are useful for glow.",
              "Overlay and Color Dodge create stronger highlights.",
            ],
          },
          {
            title: "Flip / Rotate",
            purpose: "Transform the active layer quickly.",
            steps: [
              "Flip H mirrors the layer horizontally.",
              "Flip V mirrors the layer vertically.",
              "Rotate turns the layer 90 degrees.",
              "These actions only affect the active layer.",
            ],
          },
          {
            title: "Outline / Grayscale / Invert / Hue Shift",
            purpose: "Apply quick effects to the active layer.",
            steps: [
              "Outline adds a 1-pixel border around painted pixels.",
              "Grayscale converts the layer to black and white.",
              "Invert reverses colors.",
              "Hue Shift rotates the layer's color tone.",
            ],
          },
        ],
      },
      {
        id: "palette",
        title: "Colors & Palette",
        subtitle: "Swatches, presets, ramps, harmony",
        icon: Palette,
        color: "#ec4899",
        summary:
          "Manage primary/secondary colors, presets, palette import/export, ramps, and generated harmonies.",
        items: [
          {
            title: "Primary / Secondary color",
            purpose: "Keep two colors ready for fast work.",
            steps: [
              "Left-click a swatch to set Primary.",
              "Right-click a swatch to set Secondary.",
              "Primary is used by most tools; Secondary is useful for quick color switching.",
            ],
          },
          {
            title: "Palette presets",
            purpose: "Use built-in color sets.",
            steps: [
              "Open Load preset in the Palette panel.",
              "Choose PICO-8, Game Boy, NES, Sweetie 16, or Endesga 16.",
              "The preset replaces the current project palette.",
            ],
          },
          {
            title: "Add / Delete / Sort",
            purpose: "Edit the swatch list.",
            steps: [
              "Add current adds the primary color to the palette.",
              "Del removes the selected swatch.",
              "Sort hue orders colors by hue.",
              "Sort lum orders colors by brightness.",
            ],
          },
          {
            title: "Ramp generator",
            purpose: "Create a color ramp from shadow to highlight.",
            steps: [
              "Choose the start and end colors.",
              "Enter the number of ramp steps.",
              "Click Add to append the generated colors to the palette.",
            ],
            tips: ["A 4-6 color ramp is a strong base for small sprite shading."],
          },
          {
            title: "Color harmony",
            purpose: "Generate colors that work with the current color.",
            steps: [
              "Complement creates the opposite hue.",
              "Analogous creates two nearby hues.",
              "Triadic creates a balanced three-color set.",
            ],
          },
          {
            title: "Import / Export palette",
            purpose: "Share and reload palettes.",
            steps: [
              "Click the down arrow to export a palette JSON.",
              "Click the up arrow to import a palette JSON.",
              "The palette file is a list of hex colors.",
            ],
          },
        ],
      },
      {
        id: "animation",
        title: "Animation",
        subtitle: "Frames, timing, preview, tags",
        icon: Film,
        color: "#f59e0b",
        summary:
          "Create frame animation with timeline controls, frame duration, onion skinning, and tags.",
        items: [
          {
            title: "Frame timeline",
            purpose: "Manage the animation frame sequence.",
            steps: [
              "Each thumbnail represents one frame.",
              "Click a thumbnail to edit that frame.",
              "Click Play to preview the animation.",
            ],
          },
          {
            title: "Add / duplicate / delete frames",
            purpose: "Create motion from multiple frames.",
            steps: [
              "Click + to add a frame after the current one.",
              "Click Duplicate to copy the current frame.",
              "Click Delete to remove a frame when more than one frame exists.",
            ],
            tips: ["A good workflow is duplicate, make a small edit, then play the result."],
          },
          {
            title: "Duration in ms",
            purpose: "Control each frame's timing.",
            steps: [
              "Enter milliseconds under a thumbnail.",
              "Smaller values play faster.",
              "Larger values create holds or hit-pause moments.",
            ],
          },
          {
            title: "Onion skin",
            purpose: "See neighboring frames while drawing motion.",
            steps: [
              "Enable Onion in the Canvas panel.",
              "Normal mode shows ghosted frames.",
              "Pro mode tints the previous frame red and the next frame green.",
            ],
          },
          {
            title: "Animation Tags",
            purpose: "Split animation into Idle, Run, Jump, Attack, and more.",
            steps: [
              "Click Add Tag in Animation Preview.",
              "Name the tag and adjust From/To frames.",
              "Click the tag to activate it.",
              "When active, playback and export use only that tag range.",
            ],
          },
        ],
      },
      {
        id: "files",
        title: "Files, Autosave & Recovery",
        subtitle: "Save, open, restore, migrate older files",
        icon: Save,
        color: "#facc15",
        summary: "Autosave protects drafts, but Save Project remains the main backup workflow.",
        items: [
          {
            title: "Autosave",
            purpose: "Automatically save drafts to localStorage.",
            steps: [
              "After project changes, Pixora waits 1.5 seconds before saving.",
              "Pixel data is RLE-compressed to reduce storage size.",
              "Autosave lives in the current browser and is not cloud-synced.",
            ],
          },
          {
            title: "Restore Modal",
            purpose: "Recover a previous browser session.",
            steps: [
              "When Studio opens with an autosave available, Unsaved Session Found appears.",
              "The modal shows canvas size, frame count, and save time.",
              "Click Restore to continue or Discard to remove the draft.",
            ],
          },
          {
            title: "Save Project",
            purpose: "Download a JSON project file.",
            steps: [
              "Open File > Save Project.",
              "The downloaded file is named pixora-project.json.",
              "Keep this file if you want to back up or move work between machines.",
            ],
          },
          {
            title: "Open JSON",
            purpose: "Load a Pixora project or an older PixelForge file.",
            steps: [
              "Open File > Open JSON.",
              "Choose a .json file.",
              "Older projects are migrated to the current Pixora schema.",
            ],
          },
          {
            title: "Clear Autosave",
            purpose: "Remove the browser draft.",
            steps: [
              "Open File > Clear Autosave.",
              "Or open Command Palette and search Clear autosave.",
              "Use this after saving JSON if you want to clear the previous session.",
            ],
          },
        ],
      },
      {
        id: "export",
        title: "Export",
        subtitle: "PNG, Sprite Sheet, GIF, WebM",
        icon: Download,
        color: "#3b82f6",
        summary: "Export still images, game-ready sprite sheets, shareable GIFs, and WebM videos.",
        items: [
          {
            title: "Export Scale",
            purpose: "Scale pixel art up when exporting.",
            steps: [
              "Set Scale from 1 to 32 in the Export menu.",
              "A 32 x 32 canvas at scale 8 becomes a 256 x 256 image.",
              "Image smoothing is disabled so pixels stay crisp.",
            ],
            tips: ["Scale 8 or 16 usually looks good for web and social sharing."],
          },
          {
            title: "Export PNG",
            purpose: "Export the current frame as a PNG image.",
            steps: [
              "Select the frame you want.",
              "Open Export > Export PNG.",
              "The file downloads as pixora-frame-N.png.",
            ],
          },
          {
            title: "Export Sprite Sheet",
            purpose: "Join multiple frames into one horizontal image for game engines.",
            steps: [
              "Open Export > Export Sprite Sheet.",
              "All frames, or only the active tag range, are placed horizontally.",
              "Use it in Unity, Godot, Phaser, or custom engines.",
            ],
          },
          {
            title: "Export GIF",
            purpose: "Create a quick shareable animation.",
            steps: [
              "Open Export > Export GIF.",
              "GIF export respects each frame's duration.",
              "If a tag is active, only that tag range is exported.",
            ],
          },
          {
            title: "Export WebM",
            purpose: "Create smoother and lighter video than GIF.",
            steps: [
              "Open Export > Export Video (WebM).",
              "Pixora renders animation to canvas and records WebM.",
              "Use it for demos, web pages, and social posts.",
            ],
          },
        ],
      },
      {
        id: "shortcuts",
        title: "Shortcuts & Command Palette",
        subtitle: "Work faster with the keyboard",
        icon: Keyboard,
        color: "#14b8a6",
        summary: "Important shortcuts and how to use Ctrl+K / Cmd+K to find commands instantly.",
        items: [
          {
            title: "Tool shortcuts",
            purpose: "Switch tools without leaving the keyboard.",
            steps: [
              "B Brush, D Dither, E Eraser, F Fill, I Picker.",
              "L Line, R Rectangle, C Ellipse.",
              "S Selection, W Magic Wand, M Move.",
            ],
          },
          {
            title: "Edit shortcuts",
            purpose: "Control history and selections.",
            steps: [
              "Ctrl+Z undo.",
              "Ctrl+Y or Ctrl+Shift+Z redo.",
              "Ctrl+C copy selection, Ctrl+V paste, Ctrl+X cut.",
              "Delete clears selection, Esc closes modals or clears selection.",
            ],
          },
          {
            title: "Command Palette",
            shortcut: "Ctrl+K / Cmd+K",
            purpose: "Search and run commands by name.",
            steps: [
              "Press Ctrl+K on Windows/Linux or Cmd+K on Mac.",
              "Type commands like resize, export png, gif, outline, grayscale.",
              "Use arrow keys to select and Enter to run.",
            ],
            tips: ["If you do not remember where a feature lives, open Command Palette first."],
          },
        ],
      },
      {
        id: "workflows",
        title: "Example Workflows",
        subtitle: "Practical flows for sprites and tiles",
        icon: Sparkles,
        color: "#fb7185",
        summary:
          "Suggested workflows for character sprites, game items, idle animation, and seamless tiles.",
        items: [
          {
            title: "32 x 32 character sprite",
            purpose: "Build a clean layered character sprite.",
            steps: [
              "Create a 32 x 32 canvas.",
              "Layer 1: sketch or overall shape.",
              "Layer 2: line art.",
              "Layer 3: base colors.",
              "Layer 4: shadows and highlights.",
            ],
          },
          {
            title: "Game item or icon",
            purpose: "Create a small object that reads clearly in-game.",
            steps: [
              "Use Sym 4 or Mirror X if the item is symmetrical.",
              "Use a dark outline so the item stands out.",
              "Export PNG at scale 8 or 16.",
            ],
          },
          {
            title: "Idle animation",
            purpose: "Add subtle motion to a character.",
            steps: [
              "Draw the first frame.",
              "Duplicate it into 3-4 frames.",
              "Move the head, arms, or clothing up/down by 1 pixel.",
              "Set duration around 140-220ms.",
              "Create an Idle tag for separate export.",
            ],
          },
          {
            title: "Seamless tile",
            purpose: "Create a repeating texture without visible seams.",
            steps: [
              "Enable Tile Preview.",
              "Paint details that continue across left/right and top/bottom edges.",
              "Check seams in the 3 x 3 preview.",
              "Export PNG at scale 1 if using directly in a game engine.",
            ],
          },
        ],
      },
    ],
  },
};

function GuidePage() {
  const [language, setLanguage] = useState<Language>("vi");
  const [activeId, setActiveId] = useState(copy.vi.sections[0].id);
  const [query, setQuery] = useState("");
  const current = copy[language];

  const activeSection =
    current.sections.find((section) => section.id === activeId) ?? current.sections[0];

  const visibleItems = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    const entries = current.sections.flatMap((section) =>
      section.items.map((item) => ({ item, section })),
    );

    if (!normalized) {
      return activeSection.items.map((item) => ({ item, section: activeSection }));
    }

    return entries.filter(({ item, section }) =>
      [
        section.title,
        section.subtitle,
        section.summary,
        item.title,
        item.purpose,
        item.shortcut ?? "",
        ...item.steps,
        ...(item.tips ?? []),
      ]
        .join(" ")
        .toLowerCase()
        .includes(normalized),
    );
  }, [activeSection, current.sections, query]);

  const displaySection = query.trim() && visibleItems[0] ? visibleItems[0].section : activeSection;

  return (
    <div className="min-h-screen bg-[#070816] text-slate-100">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>

      <header className="sticky top-0 z-30 border-b border-white/10 bg-[#080918]/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
          <div className="flex min-w-0 items-center gap-3">
            <Link
              to="/studio"
              className="grid h-9 w-9 place-items-center rounded-md border border-white/10 bg-white/5 text-slate-300 transition hover:bg-white/10 hover:text-white"
              aria-label={current.back}
            >
              <ArrowLeft size={17} />
            </Link>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <BookOpen size={18} className="text-fuchsia-300" />
                <h1 className="truncate text-lg font-black tracking-tight sm:text-2xl">
                  {current.title}
                </h1>
                <span className="rounded border border-fuchsia-300/30 bg-fuchsia-400/10 px-2 py-0.5 text-[10px] font-bold text-fuchsia-200">
                  v5.1
                </span>
              </div>
              <p className="hidden text-xs text-slate-400 sm:block">{current.intro}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex rounded-md border border-white/10 bg-white/5 p-1">
              {(["vi", "en"] as const).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  aria-label={lang === "vi" ? "Tiếng Việt" : "English"}
                  title={lang === "vi" ? "Tiếng Việt" : "English"}
                  className={`grid h-8 w-9 place-items-center rounded text-lg leading-none transition ${
                    language === lang
                      ? "bg-fuchsia-500 shadow-[0_0_18px_rgba(217,70,239,0.35)]"
                      : "opacity-55 hover:bg-white/10 hover:opacity-100"
                  }`}
                >
                  <span aria-hidden="true" className="flex items-center justify-center">
                    {lang === "vi" ? <VnFlag /> : <EnFlag />}
                  </span>
                </button>
              ))}
            </div>
            <Link
              to="/studio"
              className="hidden items-center gap-2 rounded-md bg-fuchsia-500 px-4 py-2 text-xs font-bold text-white shadow-[0_0_24px_rgba(217,70,239,0.35)] transition hover:bg-fuchsia-400 sm:flex"
              style={pixelFont}
            >
              Studio
            </Link>
          </div>
        </div>
      </header>

      <main className="relative z-10 mx-auto grid max-w-7xl gap-5 px-4 py-5 lg:grid-cols-[300px_1fr]">
        <aside className="lg:sticky lg:top-[73px] lg:h-[calc(100vh-92px)]">
          <div className="rounded-lg border border-white/10 bg-white/[0.04] p-3 shadow-2xl">
            <label className="relative block">
              <Search
                size={15}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
              />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={current.searchPlaceholder}
                className="h-10 w-full rounded-md border border-white/10 bg-black/30 pl-9 pr-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-fuchsia-300/50"
              />
            </label>

            <p className="mb-2 mt-4 px-2 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
              {current.contents}
            </p>
            <nav className="max-h-[58vh] space-y-1 overflow-y-auto pr-1 lg:max-h-[calc(100vh-190px)]">
              {current.sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => {
                    setActiveId(section.id);
                    setQuery("");
                  }}
                  className={`flex w-full items-center gap-3 rounded-md border px-3 py-2 text-left transition ${
                    activeId === section.id && !query
                      ? "border-white/20 bg-white/10"
                      : "border-transparent text-slate-400 hover:bg-white/[0.06] hover:text-white"
                  }`}
                >
                  <section.icon size={16} style={{ color: section.color }} />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-semibold">{section.title}</div>
                    <div className="truncate text-[11px] text-slate-500">{section.subtitle}</div>
                  </div>
                </button>
              ))}
            </nav>
          </div>
        </aside>

        <section className="min-w-0">
          <div className="overflow-hidden rounded-lg border border-white/10 bg-white/[0.045] shadow-2xl">
            <div
              className="border-b border-white/10 p-5 sm:p-7"
              style={{
                background: `linear-gradient(135deg, ${displaySection.color}22, rgba(255,255,255,0.03))`,
              }}
            >
              <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                <div className="flex gap-4">
                  <div
                    className="grid h-14 w-14 shrink-0 place-items-center rounded-lg border"
                    style={{
                      color: displaySection.color,
                      background: `${displaySection.color}16`,
                      borderColor: `${displaySection.color}44`,
                    }}
                  >
                    <displaySection.icon size={27} />
                  </div>
                  <div>
                    <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.24em] text-slate-400">
                      {query ? (language === "vi" ? "Tìm kiếm" : "Search") : current.guideLabel}
                    </p>
                    <h2 className="text-2xl font-black tracking-tight text-white sm:text-4xl">
                      {query ? current.searchTitle(query) : displaySection.title}
                    </h2>
                    <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">
                      {query ? current.searchSummary(visibleItems.length) : displaySection.summary}
                    </p>
                  </div>
                </div>
                <Link
                  to="/studio"
                  className="inline-flex shrink-0 items-center justify-center gap-2 rounded-md border border-white/10 bg-white/10 px-4 py-2 text-xs font-bold text-white transition hover:bg-white/15"
                >
                  {current.openStudio}
                </Link>
              </div>
            </div>

            {visibleItems.length === 0 ? (
              <div className="p-10 text-center">
                <Search size={32} className="mx-auto mb-3 text-slate-500" />
                <h3 className="font-bold text-white">{current.emptyTitle}</h3>
                <p className="mt-2 text-sm text-slate-400">{current.emptyBody}</p>
              </div>
            ) : (
              <div className="grid gap-4 p-4 sm:p-6">
                {visibleItems.map(({ item, section }, index) => (
                  <GuideCard
                    key={`${language}-${section.id}-${item.title}`}
                    item={item}
                    section={section}
                    index={index}
                    labels={current}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

function GuideCard({
  item,
  section,
  index,
  labels,
}: {
  item: GuideItem;
  section: GuideSection;
  index: number;
  labels: GuideCopy;
}) {
  return (
    <article className="rounded-lg border border-white/10 bg-black/25 p-4 transition hover:border-white/20 hover:bg-black/30 sm:p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 gap-3">
          <div
            className="grid h-9 w-9 shrink-0 place-items-center rounded-md border text-xs font-black"
            style={{
              color: section.color,
              borderColor: `${section.color}40`,
              background: `${section.color}12`,
            }}
          >
            {String(index + 1).padStart(2, "0")}
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-lg font-black text-white">{item.title}</h3>
              {item.shortcut && <Kbd>{item.shortcut}</Kbd>}
            </div>
            <p className="mt-1 text-sm leading-6 text-slate-300">
              <span className="font-semibold text-slate-100">{labels.purposeLabel}: </span>
              {item.purpose}
            </p>
          </div>
        </div>
        <span
          className="w-fit rounded px-2 py-1 text-[10px] font-bold uppercase tracking-wider"
          style={{
            color: section.color,
            background: `${section.color}12`,
          }}
        >
          {section.title}
        </span>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_0.75fr]">
        <div>
          <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
            <Command size={13} />
            {labels.stepsLabel}
          </div>
          <ol className="space-y-2">
            {item.steps.map((line, stepIndex) => (
              <li key={line} className="flex gap-3 text-sm leading-6 text-slate-300">
                <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded bg-white/10 text-[10px] font-bold text-white">
                  {stepIndex + 1}
                </span>
                <span>{line}</span>
              </li>
            ))}
          </ol>
        </div>

        <div className="rounded-md border border-white/10 bg-white/[0.035] p-3">
          <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
            <Sparkles size={13} />
            {labels.tipsLabel}
          </div>
          {item.tips?.length ? (
            <ul className="space-y-2">
              {item.tips.map((tip) => (
                <li key={tip} className="text-sm leading-6 text-slate-300">
                  {tip}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm leading-6 text-slate-400">{labels.defaultTip}</p>
          )}
        </div>
      </div>
    </article>
  );
}

function Kbd({ children }: { children: string }) {
  return (
    <kbd className="rounded border border-white/15 bg-white/10 px-2 py-0.5 font-mono text-[11px] font-bold text-fuchsia-100">
      {children}
    </kbd>
  );
}

function VnFlag() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 600" className="h-3.5 w-5 rounded-sm object-cover shadow-sm">
      <rect fill="#da251d" width="900" height="600" />
      <polygon fill="#ffcd00" points="450,114.6 548.8,418.7 290.1,230.7 609.9,230.7 351.2,418.7" />
    </svg>
  );
}

function EnFlag() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 30" className="h-3.5 w-5 rounded-sm object-cover shadow-sm">
      <rect width="50" height="30" fill="#fff" />
      <path d="M22,0 h6 v30 h-6 z M0,12 h50 v6 h-50 z" fill="#ce1124" />
    </svg>
  );
}
