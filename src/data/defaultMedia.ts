import { VisualMediaItem } from '../types';

/**
 * Curated real-world educational photos & videos for Grade 4 Technology
 * Bộ sách Kết nối tri thức với cuộc sống
 */
export const defaultMediaList: VisualMediaItem[] = [
  // ==========================================
  // TIẾT 1: Lợi ích của hoa và cây cảnh
  // ==========================================
  {
    id: 'media-p1-1',
    periodNumber: 1,
    type: 'image',
    url: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=1200&q=80',
    title: 'Vườn hoa công viên trường học rực rỡ',
    caption: 'Hoa và cây cảnh giúp làm đẹp cảnh quan khuôn viên trường học, tạo bầu không khí trong lành và thư giãn cho học sinh.',
    author: 'Tư liệu thực tế',
  },
  {
    id: 'media-p1-2',
    periodNumber: 1,
    type: 'image',
    url: 'https://images.unsplash.com/photo-1463936575829-25148e1db1b8?auto=format&fit=crop&w=1200&q=80',
    title: 'Chậu cây cảnh thanh lọc không khí trong phòng',
    caption: 'Cây xanh hấp thụ khí carbon dioxide (CO₂) và nhả khí oxygen (O₂), đồng thời giữ lại bụi bẩn trên mặt lá.',
    author: 'Tư liệu thực tế',
  },
  {
    id: 'media-p1-3',
    periodNumber: 1,
    type: 'video',
    url: 'https://www.youtube.com/watch?v=1F2bXqj_VfQ',
    title: 'Video: Khám phá lợi ích tuyệt vời của cây xanh và hoa cảnh',
    caption: 'Video trực quan giúp học sinh quan sát quá trình cây cối quang hợp, làm sạch không khí và tô điểm cuộc sống.',
    author: 'Kênh Khoa học Tiểu học',
  },

  // ==========================================
  // TIẾT 2: Nhận biết một số loại hoa phổ biến
  // ==========================================
  {
    id: 'media-p2-1',
    periodNumber: 2,
    type: 'image',
    url: 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=1200&q=80',
    title: 'Hoa hồng nhung đỏ thắm nở rộ',
    caption: 'Quan sát các lớp cánh hoa xếp tầng dày dặn, thân cây có gai nhọn và hương thơm dịu nhẹ đặc trưng.',
    author: 'Tư liệu thực tế',
  },
  {
    id: 'media-p2-2',
    periodNumber: 2,
    type: 'image',
    url: 'https://images.unsplash.com/photo-1597848212624-a19eb35e2651?auto=format&fit=crop&w=1200&q=80',
    title: 'Hoa cúc vàng tươi sáng',
    caption: 'Hoa cúc có nhiều cánh nhỏ thuôn dài xếp quanh nhị tròn, thường nở bền lâu vào mùa thu và dịp Tết.',
    author: 'Tư liệu thực tế',
  },
  {
    id: 'media-p2-3',
    periodNumber: 2,
    type: 'image',
    url: 'https://images.unsplash.com/photo-1606041008023-472dfb5e530f?auto=format&fit=crop&w=1200&q=80',
    title: 'Cành hoa đào bích rực rỡ đón xuân',
    caption: 'Hoa đào là biểu tượng ngày Tết cổ truyền của miền Bắc, hoa nở rộ với sắc hồng tươi thắm báo hiệu mùa xuân.',
    author: 'Tư liệu thực tế',
  },
  {
    id: 'media-p2-4',
    periodNumber: 2,
    type: 'video',
    url: 'https://www.youtube.com/watch?v=V3xK3m1_r20',
    title: 'Video: Cận cảnh các loài hoa khoe sắc 4 mùa',
    caption: 'Video quay chậm (time-lapse) từng cánh hoa đào, hoa mai, hoa hồng hé nở giúp học sinh thích thú quan sát.',
    author: 'Tư liệu thiên nhiên',
  },

  // ==========================================
  // TIẾT 3: Nhận biết một số loại cây cảnh phổ biến
  // ==========================================
  {
    id: 'media-p3-1',
    periodNumber: 3,
    type: 'image',
    url: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=1200&q=80',
    title: 'Cây Kim Phát Tài (Kim tiền) lá xanh bóng',
    caption: 'Lá dày mọng nước, mọc đối xứng thành từng cuống dài, có khả năng chịu khô hạn tốt và thích hợp trồng trong nhà.',
    author: 'Tư liệu thực tế',
  },
  {
    id: 'media-p3-2',
    periodNumber: 3,
    type: 'image',
    url: 'https://images.unsplash.com/photo-1599598425947-320b60166297?auto=format&fit=crop&w=1200&q=80',
    title: 'Cây Lưỡi Hổ viền vàng thẳng đứng',
    caption: 'Lá cứng, mọc vươn thẳng từ gốc lên cao như ngọn giáo, viền lá màu vàng sáng giúp lọc bụi mịn rất tốt.',
    author: 'Tư liệu thực tế',
  },
  {
    id: 'media-p3-3',
    periodNumber: 3,
    type: 'image',
    url: 'https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=1200&q=80',
    title: 'Cây Trầu Bà (Vạn niên thanh) leo xanh mát',
    caption: 'Lá hình trái tim bóng mượt, thân leo mềm mại, có thể trồng trong chậu đất hoặc trồng thủy canh trong bình nước.',
    author: 'Tư liệu thực tế',
  },

  // ==========================================
  // TIẾT 4: Vận dụng nhận biết & trang trí hoa cây cảnh
  // ==========================================
  {
    id: 'media-p4-1',
    periodNumber: 4,
    type: 'image',
    url: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=1200&q=80',
    title: 'Góc ban công và lớp học trang trí chậu hoa xanh',
    caption: 'Sắp xếp chậu hoa cây cảnh hợp lý theo chiều cao: cây lớn phía trong, chậu hoa nở sắc rực rỡ ở phía ngoài.',
    author: 'Tư liệu thực tế',
  },

  // ==========================================
  // TIẾT 5: Chậu trồng hoa và cây cảnh
  // ==========================================
  {
    id: 'media-p5-1',
    periodNumber: 5,
    type: 'image',
    url: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=1200&q=80',
    title: 'Chậu đất nung truyền thống có lỗ thoát nước',
    caption: 'Quan sát lỗ thoát nước dưới đáy chậu. Thành chậu đất nung có khả năng thấm hút và thoát hơi nước rất tốt giúp rễ không bị úng.',
    author: 'Tư liệu thực tế',
  },
  {
    id: 'media-p5-2',
    periodNumber: 5,
    type: 'image',
    url: 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=1200&q=80',
    title: 'Các loại chậu nhựa nhẹ, bền và nhiều màu sắc',
    caption: 'Chậu nhựa dễ di chuyển, không sợ vỡ khi rơi, thích hợp cho học sinh tiểu học thực hành trồng cây.',
    author: 'Tư liệu thực tế',
  },

  // ==========================================
  // TIẾT 6: Giá thể và đất trồng cây trong chậu
  // ==========================================
  {
    id: 'media-p6-1',
    periodNumber: 6,
    type: 'image',
    url: 'https://images.unsplash.com/photo-1592417817098-8f3d69102a5c?auto=format&fit=crop&w=1200&q=80',
    title: 'Giá thể xơ dừa và trấu hun tơi xốp',
    caption: 'Hỗn hợp xơ dừa xay nhỏ và trấu hun giúp đất trồng thoáng khí, giữ ẩm vừa phải và không làm nghẹt rễ non.',
    author: 'Tư liệu thực tế',
  },
  {
    id: 'media-p6-2',
    periodNumber: 6,
    type: 'image',
    url: 'https://images.unsplash.com/photo-1584467735815-f778f274e296?auto=format&fit=crop&w=1200&q=80',
    title: 'Đất mùn hữu cơ vi sinh màu đen giàu dinh dưỡng',
    caption: 'Đất tơi xốp, màu đen thẫm, sạch mầm bệnh và chứa đầy đủ khoáng chất cho rễ cây phát triển mạnh mẽ.',
    author: 'Tư liệu thực tế',
  },

  // ==========================================
  // TIẾT 7: Dụng cụ trồng hoa và cây cảnh trong chậu
  // ==========================================
  {
    id: 'media-p7-1',
    periodNumber: 7,
    type: 'image',
    url: 'https://images.unsplash.com/photo-1617576683096-00fc8eecb3af?auto=format&fit=crop&w=1200&q=80',
    title: 'Bộ dụng cụ làm vườn mini dành cho học sinh',
    caption: 'Bao gồm xẻng con xúc đất, cào ba răng xới đất, kéo cắt tỉa cành và găng tay bảo hộ lao động vừa tay học sinh.',
    author: 'Tư liệu thực tế',
  },
  {
    id: 'media-p7-2',
    periodNumber: 7,
    type: 'image',
    url: 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&w=1200&q=80',
    title: 'Bình tưới vòi hoa sen tạo tia nước mịn',
    caption: 'Đầu vòi sen chia nhiều lỗ nhỏ giúp tia nước tỏa đều, không làm xói lở đất gốc và không làm dập nát mầm non.',
    author: 'Tư liệu thực tế',
  },
  {
    id: 'media-p7-3',
    periodNumber: 7,
    type: 'video',
    url: 'https://www.youtube.com/watch?v=3gU_i95r470',
    title: 'Video: Nhận biết và sử dụng dụng cụ làm vườn an toàn',
    caption: 'Hướng dẫn học sinh cách cầm xẻng, cào đất và vệ sinh dụng cụ sạch sẽ sau khi dùng xong.',
    author: 'Kỹ thuật Tiểu học',
  },

  // ==========================================
  // TIẾT 8-11: Gieo hạt hoa và cây cảnh trong chậu
  // ==========================================
  {
    id: 'media-p8-1',
    periodNumber: 8,
    type: 'image',
    url: 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?auto=format&fit=crop&w=1200&q=80',
    title: 'Hạt giống hoa nảy mầm nứt nanh sau khi ngâm ủ',
    caption: 'Hạt ngâm trong nước ấm (2 phần nước sôi + 3 phần nước lạnh) từ 4 – 6 giờ, sau đó ủ khăn ẩm cho nứt vỏ.',
    author: 'Tư liệu thực tế',
  },
  {
    id: 'media-p9-1',
    periodNumber: 9,
    type: 'image',
    url: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=1200&q=80',
    title: 'Cho giá thể vào chậu và san phẳng mặt đất',
    caption: 'Lót sỏi hoặc mảnh sành dưới đáy chậu để thoát nước, cho đất vào cách miệng chậu khoảng 2 – 3 cm.',
    author: 'Tư liệu thực tế',
  },
  {
    id: 'media-p10-1',
    periodNumber: 10,
    type: 'image',
    url: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=1200&q=80',
    title: 'Mầm hoa non đội đất vươn lên xanh tốt',
    caption: 'Sau 3 – 5 ngày được tưới ẩm đầy đủ, mầm xanh nhú lên 2 lá mầm đầu tiên đón ánh sáng mặt trời dịu nhẹ.',
    author: 'Tư liệu thực tế',
  },
  {
    id: 'media-p10-2',
    periodNumber: 10,
    type: 'video',
    url: 'https://www.youtube.com/watch?v=eKo5F87A8a0',
    title: 'Video: Hướng dẫn chi tiết các bước gieo hạt trong chậu',
    caption: 'Video thực tế quy trình gieo hạt hoa hướng dương từ chuẩn bị chậu, đất, gieo hạt đến tưới ẩm hàng ngày.',
    author: 'Vườn ươm Trẻ thơ',
  },

  // ==========================================
  // TIẾT 12-16: Trồng cây hoa, cây cảnh trong chậu
  // ==========================================
  {
    id: 'media-p12-1',
    periodNumber: 12,
    type: 'image',
    url: 'https://images.unsplash.com/photo-1592150621744-aca64f48394a?auto=format&fit=crop&w=1200&q=80',
    title: 'Cây giống hoa cúc con trong bầu ươm khỏe mạnh',
    caption: 'Chọn cây giống có thân mập mạp, lá xanh tươi không sâu bệnh, bộ rễ chùm phát triển trắng nõn.',
    author: 'Tư liệu thực tế',
  },
  {
    id: 'media-p13-1',
    periodNumber: 13,
    type: 'image',
    url: 'https://images.unsplash.com/photo-1463936575829-25148e1db1b8?auto=format&fit=crop&w=1200&q=80',
    title: 'Đặt cây con thẳng đứng vào hốc giữa chậu',
    caption: 'Xé nhẹ túi bầu ni-lông tránh vỡ rễ, đặt cây thẳng đứng ngay tâm chậu rồi vun đất xung quanh gốc.',
    author: 'Tư liệu thực tế',
  },
  {
    id: 'media-p14-1',
    periodNumber: 14,
    type: 'image',
    url: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=1200&q=80',
    title: 'Ấn nhẹ đất quanh gốc và tưới nước đẫm',
    caption: 'Dùng đầu ngón tay ấn nhẹ xung quanh gốc cho cây đứng vững vàng, sau đó tưới nhẹ nhàng bằng bình hoa sen.',
    author: 'Tư liệu thực tế',
  },
  {
    id: 'media-p14-2',
    periodNumber: 14,
    type: 'video',
    url: 'https://www.youtube.com/watch?v=w77zPAtVTuI',
    title: 'Video: Thực hành trồng cây hoa trong chậu chi tiết',
    caption: 'Các thao tác tỉ mỉ của nghệ nhân làm vườn giúp học sinh dễ dàng bắt chước và làm đúng kỹ thuật.',
    author: 'Kênh Dạy nghề Nông nghiệp',
  },

  // ==========================================
  // TIẾT 17-20: Chăm sóc hoa và cây cảnh trong chậu
  // ==========================================
  {
    id: 'media-p17-1',
    periodNumber: 17,
    type: 'image',
    url: 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&w=1200&q=80',
    title: 'Tưới nước vào gốc cây vào lúc sáng sớm',
    caption: 'Tưới đều xung quanh gốc, không tưới đẫm vào hoa lúc trời nắng gắt tránh làm cháy cánh hoa và sốc nhiệt.',
    author: 'Tư liệu thực tế',
  },
  {
    id: 'media-p18-1',
    periodNumber: 18,
    type: 'image',
    url: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=1200&q=80',
    title: 'Dùng khăn ẩm lau sạch bụi trên mặt lá cây cảnh',
    caption: 'Lau nhẹ nhàng mặt trên và dưới của lá giúp khí khổng thông thoáng, cây quang hợp tốt hơn và luôn bóng đẹp.',
    author: 'Tư liệu thực tế',
  },
  {
    id: 'media-p19-1',
    periodNumber: 19,
    type: 'image',
    url: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=1200&q=80',
    title: 'Tỉa lá già úa và bón phân hữu cơ quanh gốc',
    caption: 'Cắt bỏ lá vàng, hoa héo để hạn chế sâu bệnh, bón phân hữu cơ vi sinh cách gốc 3 – 5 cm rồi tưới nước.',
    author: 'Tư liệu thực tế',
  },
  {
    id: 'media-p18-2',
    periodNumber: 18,
    type: 'video',
    url: 'https://www.youtube.com/watch?v=7X8vaSI8FLs',
    title: 'Video: Hướng dẫn chăm sóc chậu hoa cây cảnh tại nhà',
    caption: 'Video sinh động ghi lại các công việc nhổ cỏ, bắt sâu, lau lá và bón phân cho chậu hoa.',
    author: 'Sống Xanh Cùng Em',
  },

  // ==========================================
  // TIẾT 21-23: Bộ lắp ghép mô hình kĩ thuật
  // ==========================================
  {
    id: 'media-p21-1',
    periodNumber: 21,
    type: 'image',
    url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80',
    title: 'Hộp đồ nghề lắp ghép mô hình kĩ thuật lớp 4 thực tế',
    caption: 'Hộp nhựa có nhiều ngăn phân loại: các tấm phẳng, thanh thẳng, ốc vít, đai ốc, bánh xe và trục quay.',
    author: 'Tư liệu thực tế',
  },
  {
    id: 'media-p21-2',
    periodNumber: 21,
    type: 'image',
    url: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=1200&q=80',
    title: 'Dụng cụ cờ-lê kim loại và tua-vít vặn ốc',
    caption: 'Cờ-lê dùng để giữ chặt đai ốc hình lục giác, tua-vít dùng để xoáy ốc vít ren theo chiều kim đồng hồ.',
    author: 'Tư liệu thực tế',
  },
  {
    id: 'media-p22-1',
    periodNumber: 22,
    type: 'image',
    url: 'https://images.unsplash.com/photo-1508873696983-2df5293cb32f?auto=format&fit=crop&w=1200&q=80',
    title: 'Các chi tiết ốc vít ren mịn và đai ốc mạ sáng',
    caption: 'Đưa ốc vít qua các lỗ của 2 thanh kim loại, lồng đai ốc vào phía sau và dùng tua-vít vặn chặt.',
    author: 'Tư liệu thực tế',
  },
  {
    id: 'media-p21-3',
    periodNumber: 21,
    type: 'video',
    url: 'https://www.youtube.com/watch?v=9v8SgYtC1v8',
    title: 'Video: Hướng dẫn sử dụng cờ-lê và tua-vít an toàn',
    caption: 'Video minh họa cách cầm cờ-lê và tua-vít đúng góc độ giúp siết chặt bu-lông đai ốc không bị trượt tay.',
    author: 'Kỹ thuật STEM Tiểu học',
  },

  // ==========================================
  // TIẾT 24-27: Lắp ghép mô hình bập bênh
  // ==========================================
  {
    id: 'media-p24-1',
    periodNumber: 24,
    type: 'image',
    url: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&w=1200&q=80',
    title: 'Mô hình bập bênh hoàn chỉnh chuyển động trơn tru',
    caption: 'Mô hình gồm 3 bộ phận chính: giá đỡ bập bênh hình chữ U vững chãi, thanh đòn bập bênh dài và 2 ghế ngồi 2 đầu.',
    author: 'Tư liệu thực tế',
  },
  {
    id: 'media-p25-1',
    periodNumber: 25,
    type: 'image',
    url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80',
    title: 'Lắp ráp bộ phận giá đỡ bập bênh chữ U',
    caption: 'Giá đỡ cần được siết ốc thật chặt để chân đế không bị nghiêng ngả khi thanh đòn chuyển động.',
    author: 'Tư liệu thực tế',
  },
  {
    id: 'media-p26-1',
    periodNumber: 26,
    type: 'image',
    url: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=1200&q=80',
    title: 'Lắp ghế ngồi vào hai đầu thanh đòn bập bênh',
    caption: 'Ghế ngồi gắn đối xứng hai đầu bằng thanh chữ L và tấm nhỏ, giúp thanh đòn giữ thăng bằng chuẩn xác.',
    author: 'Tư liệu thực tế',
  },
  {
    id: 'media-p24-2',
    periodNumber: 24,
    type: 'video',
    url: 'https://www.youtube.com/watch?v=F3G8S7R1D1U',
    title: 'Video: Quy trình lắp ghép hoàn thiện mô hình bập bênh',
    caption: 'Hướng dẫn học sinh lắp từng chi tiết và kiểm tra độ nâng hạ nhịp nhàng của trục bập bênh.',
    author: 'Công nghệ 4 KNTT',
  },

  // ==========================================
  // TIẾT 28-33: Lắp ghép mô hình rô-bốt
  // ==========================================
  {
    id: 'media-p28-1',
    periodNumber: 28,
    type: 'image',
    url: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1200&q=80',
    title: 'Mô hình rô-bốt đồ chơi sáng tạo bằng kim loại',
    caption: 'Rô-bốt gồm các khối: thân hình hộp chữ nhật, đầu rô-bốt có ăng-ten, hai cánh tay có thể xoay và hai chân đế đứng vững.',
    author: 'Tư liệu thực tế',
  },
  {
    id: 'media-p29-1',
    periodNumber: 29,
    type: 'image',
    url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80',
    title: 'Lắp ráp khối thân và đầu rô-bốt',
    caption: 'Ghép nối các tấm chữ nhật bằng thanh góc chữ L và siết chặt ốc vít ren để tạo khung thân vững chắc.',
    author: 'Tư liệu thực tế',
  },
  {
    id: 'media-p30-1',
    periodNumber: 30,
    type: 'image',
    url: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=1200&q=80',
    title: 'Lắp tay và chân rô-bốt cân đối',
    caption: 'Khối chân đế lắp rộng để giữ thăng bằng trọng tâm, cánh tay nối bằng trục quay cử động linh hoạt.',
    author: 'Tư liệu thực tế',
  },
  {
    id: 'media-p28-2',
    periodNumber: 28,
    type: 'video',
    url: 'https://www.youtube.com/watch?v=q6tP89K_uL0',
    title: 'Video: Hướng dẫn lắp ghép mô hình Rô-bốt đồ chơi',
    caption: 'Video từng bước thực hành lắp các khối thân, tay, chân và hoàn thiện mô hình rô-bốt đẹp mắt.',
    author: 'Kỹ thuật STEM Tiểu học',
  },

  // ==========================================
  // TIẾT 34-35: Tổng kết, đánh giá & Sáng tạo kĩ thuật
  // ==========================================
  {
    id: 'media-p34-1',
    periodNumber: 34,
    type: 'image',
    url: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=1200&q=80',
    title: 'Triển lãm sản phẩm chậu hoa cây cảnh và mô hình kỹ thuật',
    caption: 'Học sinh trưng bày chậu cây tự trồng xanh tốt và mô hình bập bênh, rô-bốt tự lắp ghép tại lớp học.',
    author: 'Tư liệu thực tế',
  },
];
