//////////////////////////////////////////////////////////////////////////////
var AppName 				=	'NetInspection';
var AppBranch				=	'production';
//////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////
if(AppBranch === 'production')
{
	API 	= 'http://app.inspection.aistracking.com/';
    VERSION_TITLE =	VERSION;
	addcss("#version{ background: transparent; }");
	AWS_MaxKeys 			=	500;
	AWS_Prefix 				=	'fileobservation/';
	AWS_SignedUrl_Expires 	=	900;
	AWS_AccessKeyId 		=	'QUtJQVRRQVBYTE1HUUszTUdGMkg=';
	AWS_SecretAccessKey 	=	'andQcXBTbXptWnQ5bSticFhYNXI2UG1ibHNrcDI4MFp6R3o0S1hjdQ==';
	AWS_Region 				=	'';
	AWS_BucketName 			=	'bmV0aW5zcGVjdGlvbg==';
}
//////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////
if(AppBranch === 'developer')
{
	API 	= 	'http://app.inspection.aistracking.net/';
	VERSION_TITLE =	VERSION + '-dev';
	addcss("#version{ background: #F44336; }");
	AWS_MaxKeys 			=	500;
	AWS_Prefix 				=	'fileobservation/';
	AWS_SignedUrl_Expires 	=	900;
	AWS_AccessKeyId 		=	'';
	AWS_SecretAccessKey 	=	'';
	AWS_Region 				=	'';
	AWS_BucketName 			=	'bmV0aW5zcGVjdGlvbg==';
}
//////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////
if(AppBranch === 'local')
{
	API 	= 	'http://localhost:52154/';
    VERSION_TITLE =	VERSION + '-local';
	addcss("#version{ background: #795548; }");
	AWS_MaxKeys 			=	500;
	AWS_Prefix 				=	'fileobservation/';
	AWS_SignedUrl_Expires 	=	900;
	AWS_AccessKeyId 		=	'';
	AWS_SecretAccessKey 	=	'';
	AWS_Region 				=	'';
	AWS_BucketName 			=	'bmV0aW5zcGVjdGlvbg==';
}
//////////////////////////////////////////////////////////////////////////////