/**
* This file was auto-generated by SAP Web IDE build and includes all
* the source files required by SAPUI5 runtime for performance optimization.
* PLEASE DO NOT EDIT THIS FILE!! Changes will be overwritten the next time the build is run.
*/
jQuery.sap.registerPreloadedModules({
	"version": "2.0",
	"name": "ZHR_OVP_TM/Component-preload",
	"modules": {
		"ZHR_OVP_TM/Component.js": "(function() {\n\t\"use strict\";\n\t/*global sap, jQuery */\n\n\t/**\n\t * @fileOverview Application component to display information on entities from the GWSAMPLE_BASIC\n\t *   OData service.\n\t * @version @version@\n\t */\n\tjQuery.sap.declare(\"ZHR_OVP_TM.Component\");\n\n\tjQuery.sap.require(\"sap.ovp.app.Component\");\n\n\tsap.ovp.app.Component.extend(\"ZHR_OVP_TM.Component\", {\n\t\tmetadata: {\n\t\t\tmanifest: \"json\"\n\t\t}\n\t});\n}());",
		"ZHR_OVP_TM/localService/mockserver.js": "sap.ui.define([\r\n\t\"sap/ui/core/util/MockServer\"\r\n], function(MockServer) {\r\n\t\"use strict\";\r\n\tvar oMockServer,\r\n\t\t_sAppModulePath = \"ZHR_OVERIVEW_SRV/\";\r\n\r\n\treturn {\r\n\t\t/**\r\n\t\t * Initializes the mock server.\r\n\t\t * You can configure the delay with the URL parameter \"serverDelay\".\r\n\t\t * The local mock data in this folder is returned instead of the real data for testing.\r\n\t\t * @public\r\n\t\t */\r\n\t\tinit: function() {\r\n\t\t\tvar oUriParameters = jQuery.sap.getUriParameters(),\r\n\t\t\t\tsManifestUrl = jQuery.sap.getModulePath(_sAppModulePath + \"manifest\", \".json\"),\r\n\t\t\t\tsEntity = \"\",\r\n\t\t\t\t//entities = \"[object Object],[object Object]\",\r\n\t\t\t\tsErrorParam = oUriParameters.get(\"errorType\"),\r\n\t\t\t\tiErrorCode = sErrorParam === \"badRequest\" ? 400 : 500,\r\n\t\t\t\toManifest = jQuery.sap.syncGetJSON(sManifestUrl).data,\r\n\t\t\t\toDataSources = oManifest[\"sap.app\"].dataSources;\r\n\t\t\tfor (var property in oDataSources) {\r\n\t\t\t\tif (oDataSources.hasOwnProperty(property)) {\r\n\t\t\t\t\tvar sDataSource = oDataSources[property],\r\n\t\t\t\t\t\tsMetadataUrl = jQuery.sap.getModulePath(_sAppModulePath + sDataSource.settings.localUri.replace(\".xml\", \"\"), \".xml\"),\r\n\t\t\t\t\t\tsJsonFilesUrl = sMetadataUrl.slice(0, sMetadataUrl.lastIndexOf(\"/\") + 1),\r\n\t\t\t\t\t\tsUri = sDataSource.settings.localUri;\r\n\r\n\t\t\t\t\tif (sDataSource.settings && sDataSource.settings.localUri) {\r\n\t\t\t\t\t\tif (typeof sDataSource.type === \"undefined\" || sDataSource.type === \"OData\") {\r\n\t\t\t\t\t\t\tvar sLocalUri = jQuery.sap.getModulePath(_sAppModulePath + sDataSource.settings.localUri.replace(\".xml\", \"\"), \".xml\");\r\n\t\t\t\t\t\t\toMockServer = new MockServer({\r\n\t\t\t\t\t\t\t\trootUri: /.*\\/$/.test(sDataSource.uri) ? sDataSource.uri : sDataSource.uri + \"/\"\r\n\t\t\t\t\t\t\t});\r\n\t\t\t\t\t\t\toMockServer.simulate(sLocalUri, {\r\n\t\t\t\t\t\t\t\tsMockdataBaseUrl: sJsonFilesUrl,\r\n\t\t\t\t\t\t\t\tbGenerateMissingMockData: true\r\n\t\t\t\t\t\t\t});\r\n\t\t\t\t\t\t\toMockServer.start();\r\n\t\t\t\t\t\t}\r\n\t\t\t\t\t}\r\n\t\t\t\t\tvar aAnnotations = sDataSource.settings.annotations || [];\r\n\t\t\t\t\taAnnotations.forEach(function(sAnnotationName) {\r\n\t\t\t\t\t\tvar oAnnotation = oDataSources[sAnnotationName];\r\n\t\t\t\t\t\tvar sAnnoUri = oAnnotation.uri,\r\n\t\t\t\t\t\t\tsLocalAnnoUri = jQuery.sap.getModulePath(_sAppModulePath + oAnnotation.settings.localUri.replace(\".xml\", \"\"), \".xml\");\r\n\r\n\t\t\t\t\t\t///annotiaons\r\n\t\t\t\t\t\tnew MockServer({\r\n\t\t\t\t\t\t\trootUri: sAnnoUri,\r\n\t\t\t\t\t\t\trequests: [{\r\n\t\t\t\t\t\t\t\tmethod: \"GET\",\r\n\t\t\t\t\t\t\t\tpath: new RegExp(\"\"),\r\n\t\t\t\t\t\t\t\tresponse: function(oXhr) {\r\n\t\t\t\t\t\t\t\t\tjQuery.sap.require(\"jquery.sap.xml\");\r\n\r\n\t\t\t\t\t\t\t\t\tvar oAnnotations = jQuery.sap.sjax({\r\n\t\t\t\t\t\t\t\t\t\turl: sLocalAnnoUri,\r\n\t\t\t\t\t\t\t\t\t\tdataType: \"xml\"\r\n\t\t\t\t\t\t\t\t\t}).data;\r\n\r\n\t\t\t\t\t\t\t\t\toXhr.respondXML(200, {}, jQuery.sap.serializeXML(oAnnotations));\r\n\t\t\t\t\t\t\t\t\treturn true;\r\n\t\t\t\t\t\t\t\t}\r\n\t\t\t\t\t\t\t}]\r\n\r\n\t\t\t\t\t\t}).start();\r\n\t\t\t\t\t});\r\n\t\t\t\t}\r\n\t\t\t}\r\n\r\n\t\t\t// configure mock server with a delay of 1s\r\n\t\t\tMockServer.config({\r\n\t\t\t\tautoRespond: true,\r\n\t\t\t\tautoRespondAfter: (oUriParameters.get(\"serverDelay\") || 1000)\r\n\t\t\t});\r\n\r\n\t\t\tvar aRequests = oMockServer.getRequests(),\r\n\t\t\t\tfnResponse = function(iErrCode, sMessage, aRequest) {\r\n\t\t\t\t\taRequest.response = function(oXhr) {\r\n\t\t\t\t\t\toXhr.respond(iErrCode, {\r\n\t\t\t\t\t\t\t\"Content-Type\": \"text/plain;charset=utf-8\"\r\n\t\t\t\t\t\t}, sMessage);\r\n\t\t\t\t\t};\r\n\t\t\t\t};\r\n\r\n\t\t\t// handling the metadata error test\r\n\t\t\tif (oUriParameters.get(\"metadataError\")) {\r\n\t\t\t\taRequests.forEach(function(aEntry) {\r\n\t\t\t\t\tif (aEntry.path.toString().indexOf(\"$metadata\") > -1) {\r\n\t\t\t\t\t\tfnResponse(500, \"metadata Error\", aEntry);\r\n\t\t\t\t\t}\r\n\t\t\t\t});\r\n\t\t\t}\r\n\r\n\t\t\t// Handling request errors\r\n\t\t\tif (sErrorParam) {\r\n\t\t\t\taRequests.forEach(function(aEntry) {\r\n\t\t\t\t\tif (aEntry.path.toString().indexOf(sEntity) > -1) {\r\n\t\t\t\t\t\tfnResponse(iErrorCode, sErrorParam, aEntry);\r\n\t\t\t\t\t}\r\n\t\t\t\t});\r\n\t\t\t}\r\n\t\t\toMockServer.start();\r\n\r\n\t\t\tjQuery.sap.log.info(\"Running the app with mock data\");\r\n\r\n\t\t},\r\n\t\t/**\r\n\t\t * @public returns the mockserver of the app, should be used in integration tests\r\n\t\t * @returns {sap.ui.core.util.MockServer}\r\n\t\t */\r\n\t\tgetMockServer: function() {\r\n\t\t\treturn oMockServer;\r\n\t\t}\r\n\t};\r\n});"
	}
});