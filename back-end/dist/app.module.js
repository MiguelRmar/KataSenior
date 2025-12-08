"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const config_1 = require("@nestjs/config");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const rekognition_1 = require("./infrastructure/controllers/rekognition/rekognition");
const rekognitionService_1 = require("./application/services/rekognitionService");
const s3Service_1 = require("./application/services/s3Service");
const headers_guard_1 = require("./infrastructure/guards/headers.guard");
const response_interceptor_1 = require("./infrastructure/interceptors/response.interceptor");
const http_exception_filter_1 = require("./infrastructure/filters/http-exception.filter");
const auth_module_1 = require("./infrastructure/modules/auth.module");
const jwt_auth_guard_1 = require("./infrastructure/guards/jwt-auth.guard");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                envFilePath: 'environments/.env',
                isGlobal: true,
            }),
            auth_module_1.AuthModule,
        ],
        controllers: [app_controller_1.AppController, rekognition_1.RekognitionController],
        providers: [
            app_service_1.AppService,
            rekognitionService_1.RekognitionService,
            s3Service_1.S3Service,
            {
                provide: core_1.APP_GUARD,
                useClass: headers_guard_1.HeadersGuard,
            },
            {
                provide: core_1.APP_INTERCEPTOR,
                useClass: response_interceptor_1.ResponseInterceptor,
            },
            {
                provide: core_1.APP_FILTER,
                useClass: http_exception_filter_1.AllExceptionsFilter,
            },
            {
                provide: core_1.APP_GUARD,
                useClass: jwt_auth_guard_1.JwtAuthGuard,
            },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map