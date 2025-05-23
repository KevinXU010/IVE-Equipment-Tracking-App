USE [IVEproject]
GO
/****** Object:  Table [dbo].[BorrowRecords]    Script Date: 2025/5/14 15:30:46 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[BorrowRecords](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[equipment_id] [int] NOT NULL,
	[user_id] [int] NOT NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Equipments]    Script Date: 2025/5/14 15:30:46 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Equipments](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[name] [nvarchar](50) NULL,
	[Borrowed] [tinyint] NULL,
	[statement] [nvarchar](50) NULL,
	[description] [nvarchar](512) NULL,
	[img] [nvarchar](128) NULL,
	[qr] [nvarchar](128) NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Users]    Script Date: 2025/5/14 15:30:46 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Users](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[name] [nvarchar](50) NULL,
	[email] [nvarchar](50) NULL,
	[username] [nvarchar](50) NULL,
	[admin] [bit] NULL,
	[password] [nvarchar](100) NULL,
 CONSTRAINT [PK_Users] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
SET IDENTITY_INSERT [dbo].[BorrowRecords] ON 

INSERT [dbo].[BorrowRecords] ([id], [equipment_id], [user_id]) VALUES (1, 1, 1)
INSERT [dbo].[BorrowRecords] ([id], [equipment_id], [user_id]) VALUES (3, 3, 2)
SET IDENTITY_INSERT [dbo].[BorrowRecords] OFF
GO
SET IDENTITY_INSERT [dbo].[Equipments] ON 

INSERT [dbo].[Equipments] ([id], [name], [Borrowed], [statement], [description], [img], [qr]) VALUES (1, N'Microsoft HoloLens 2', 1, N'AR Headset', N'Enterprise-grade mixed reality headset with hand tracking and spatial mapping.', N'/MicrosoftHololens2.jpg', N'/sampleQr.jpg')
INSERT [dbo].[Equipments] ([id], [name], [Borrowed], [statement], [description], [img], [qr]) VALUES (2, N'Magic Leap 2', 0, N'AR Headset', N'Lightweight AR glasses focused on enterprise apps with improved field of view.', N'/magic_leap2.jpg', N'/sampleQr.jpg')
INSERT [dbo].[Equipments] ([id], [name], [Borrowed], [statement], [description], [img], [qr]) VALUES (3, N'Meta Quest Pro', 0, N'Mixed Reality', N'Combines VR and AR with high-res passthrough and full-color visuals.', N'/MetaQuestPro.jpg', N'/sampleQr.jpg')
INSERT [dbo].[Equipments] ([id], [name], [Borrowed], [statement], [description], [img], [qr]) VALUES (4, N'Snap AR Spectacles', 0, N'Smart Glasses', N'Wearable AR glasses by Snap with real-time filters and overlays.', N'/SnapArSpectacles.png', N'/sampleQr.jpg')
INSERT [dbo].[Equipments] ([id], [name], [Borrowed], [statement], [description], [img], [qr]) VALUES (5, N'Epson Moverio BT-40S', 0, N'AR Headset', N'Transparent smart glasses for heads-up display and industrial use.', N'/EpsonMoverioBT-40S.jpg', N'/sampleQr.jpg')
INSERT [dbo].[Equipments] ([id], [name], [Borrowed], [statement], [description], [img], [qr]) VALUES (6, N'RealWear Navigator 500', 0, N'Wearable Device', N'Voice-controlled AR headset for hands-free industrial tasks.', N'/RealWearNavigator500.jpg', N'/sampleQr.jpg')
INSERT [dbo].[Equipments] ([id], [name], [Borrowed], [statement], [description], [img], [qr]) VALUES (7, N'Vuzix Blade Upgraded', 0, N'Smart Glasses', N'Lightweight smart glasses with AR overlays and voice assistant.', N'/VuzixBladeUpgraded.jpg', N'/sampleQr.jpg')
INSERT [dbo].[Equipments] ([id], [name], [Borrowed], [statement], [description], [img], [qr]) VALUES (8, N'Lenovo ThinkReality A3', 0, N'AR Headset', N'Tethered AR glasses that connect to PCs or Motorola phones.', N'/LenovoThinkRealityA3.jpg', N'/sampleQr.jpg')
INSERT [dbo].[Equipments] ([id], [name], [Borrowed], [statement], [description], [img], [qr]) VALUES (9, N'Nreal Air', 0, N'Smart Glasses', N'AR glasses for media viewing and light interactivity via mobile.', N'/NrealAir.jpg', N'/sampleQr.jpg')
INSERT [dbo].[Equipments] ([id], [name], [Borrowed], [statement], [description], [img], [qr]) VALUES (10, N'Tilt Five', 0, N'AR Game System', N'Tabletop AR system using glasses, wand controller, and board surface.', N'/TiltFive.jpg', N'/sampleQr.jpg')
INSERT [dbo].[Equipments] ([id], [name], [Borrowed], [statement], [description], [img], [qr]) VALUES (11, N'Meta Quest 3', 0, N'VR Headset', N'Standalone VR headset with mixed reality capabilities and hand tracking.', N'/MetaQuest3.jpg', N'/sampleQr.jpg')
INSERT [dbo].[Equipments] ([id], [name], [Borrowed], [statement], [description], [img], [qr]) VALUES (12, N'Valve Index', 0, N'VR Headset', N'High-end PC-powered VR headset with precise tracking and finger-tracking controllers.', N'/ValveIndex.jpg', N'/sampleQr.jpg')
INSERT [dbo].[Equipments] ([id], [name], [Borrowed], [statement], [description], [img], [qr]) VALUES (13, N'HTC Vive Pro 2', 0, N'VR Headset', N'High-resolution VR headset with SteamVR tracking for professional use.', N'/HTCVivePro2.jpg', N'/sampleQr.jpg')
INSERT [dbo].[Equipments] ([id], [name], [Borrowed], [statement], [description], [img], [qr]) VALUES (14, N'PlayStation VR2', 0, N'VR Headset', N'Console-based VR headset with eye tracking, haptics, and high fidelity.', N'/VR_Headset.jpg', N'/sampleQr.jpg')
INSERT [dbo].[Equipments] ([id], [name], [Borrowed], [statement], [description], [img], [qr]) VALUES (15, N'Pico 4', 0, N'VR Headset', N'Lightweight standalone headset focused on gam', NULL, NULL)
SET IDENTITY_INSERT [dbo].[Equipments] OFF
GO
SET IDENTITY_INSERT [dbo].[Users] ON 

INSERT [dbo].[Users] ([id], [name], [email], [username], [admin], [password]) VALUES (1, N'Alex Pepicelli', N'alex.pepicelli@unisa.edu.au', N'alex001', 1, N'$2b$10$2zeTkRbPM13ySJ5jHILQKeQDD7S23Vdov1.vZxnvU3H/rf9VWTdz2')
INSERT [dbo].[Users] ([id], [name], [email], [username], [admin], [password]) VALUES (2, N'Qizhe Sun', N'sunqv016@mymail.unisa.edu.au', N'sunqy016', 0, N'$2b$10$2zeTkRbPM13ySJ5jHILQKeQDD7S23Vdov1.vZxnvU3H/rf9VWTdz2')
INSERT [dbo].[Users] ([id], [name], [email], [username], [admin], [password]) VALUES (3, N'Kunpeng Xu', N'xuyky010@mymail.unisa.edu.au', N'xuyky010', 0, N'$2b$10$2zeTkRbPM13ySJ5jHILQKeQDD7S23Vdov1.vZxnvU3H/rf9VWTdz2')
INSERT [dbo].[Users] ([id], [name], [email], [username], [admin], [password]) VALUES (4, N'Gaogang Xing', N'xingy001@mymail.unisa.edu.au', N'xingy001', 0, N'$2b$10$2zeTkRbPM13ySJ5jHILQKeQDD7S23Vdov1.vZxnvU3H/rf9VWTdz2')
INSERT [dbo].[Users] ([id], [name], [email], [username], [admin], [password]) VALUES (5, N'Amy Lee', N'test@test.com', N'amylee5740', 0, N'$2b$10$ud8ShjadCTmXvoIt/RoO7eTJMTJzcsWTn3ImWNmRL7WlDSuSfrmw6')
SET IDENTITY_INSERT [dbo].[Users] OFF
GO
