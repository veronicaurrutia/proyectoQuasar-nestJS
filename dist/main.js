/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ([
/* 0 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var __resourceQuery = "?100";
/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
/*globals __resourceQuery */
if (true) {
	var hotPollInterval = +__resourceQuery.slice(1) || 0;
	var log = __webpack_require__(1);

	/**
	 * @param {boolean=} fromUpdate true when called from update
	 */
	var checkForUpdate = function checkForUpdate(fromUpdate) {
		if (module.hot.status() === "idle") {
			module.hot
				.check(true)
				.then(function (updatedModules) {
					if (!updatedModules) {
						if (fromUpdate) log("info", "[HMR] Update applied.");
						return;
					}
					__webpack_require__(2)(updatedModules, updatedModules);
					checkForUpdate(true);
				})
				.catch(function (err) {
					var status = module.hot.status();
					if (["abort", "fail"].indexOf(status) >= 0) {
						log("warning", "[HMR] Cannot apply update.");
						log("warning", "[HMR] " + log.formatError(err));
						log("warning", "[HMR] You need to restart the application!");
					} else {
						log("warning", "[HMR] Update failed: " + log.formatError(err));
					}
				});
		}
	};
	setInterval(checkForUpdate, hotPollInterval);
} else {}


/***/ }),
/* 1 */
/***/ ((module) => {

/** @typedef {"info" | "warning" | "error"} LogLevel */

/** @type {LogLevel} */
var logLevel = "info";

function dummy() {}

/**
 * @param {LogLevel} level log level
 * @returns {boolean} true, if should log
 */
function shouldLog(level) {
	var shouldLog =
		(logLevel === "info" && level === "info") ||
		(["info", "warning"].indexOf(logLevel) >= 0 && level === "warning") ||
		(["info", "warning", "error"].indexOf(logLevel) >= 0 && level === "error");
	return shouldLog;
}

/**
 * @param {(msg?: string) => void} logFn log function
 * @returns {(level: LogLevel, msg?: string) => void} function that logs when log level is sufficient
 */
function logGroup(logFn) {
	return function (level, msg) {
		if (shouldLog(level)) {
			logFn(msg);
		}
	};
}

/**
 * @param {LogLevel} level log level
 * @param {string|Error} msg message
 */
module.exports = function (level, msg) {
	if (shouldLog(level)) {
		if (level === "info") {
			console.log(msg);
		} else if (level === "warning") {
			console.warn(msg);
		} else if (level === "error") {
			console.error(msg);
		}
	}
};

var group = console.group || dummy;
var groupCollapsed = console.groupCollapsed || dummy;
var groupEnd = console.groupEnd || dummy;

module.exports.group = logGroup(group);

module.exports.groupCollapsed = logGroup(groupCollapsed);

module.exports.groupEnd = logGroup(groupEnd);

/**
 * @param {LogLevel} level log level
 */
module.exports.setLogLevel = function (level) {
	logLevel = level;
};

/**
 * @param {Error} err error
 * @returns {string} formatted error
 */
module.exports.formatError = function (err) {
	var message = err.message;
	var stack = err.stack;
	if (!stack) {
		return message;
	} else if (stack.indexOf(message) < 0) {
		return message + "\n" + stack;
	} else {
		return stack;
	}
};


/***/ }),
/* 2 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

/**
 * @param {(string | number)[]} updatedModules updated modules
 * @param {(string | number)[] | null} renewedModules renewed modules
 */
module.exports = function (updatedModules, renewedModules) {
	var unacceptedModules = updatedModules.filter(function (moduleId) {
		return renewedModules && renewedModules.indexOf(moduleId) < 0;
	});
	var log = __webpack_require__(1);

	if (unacceptedModules.length > 0) {
		log(
			"warning",
			"[HMR] The following modules couldn't be hot updated: (They would need a full reload!)"
		);
		unacceptedModules.forEach(function (moduleId) {
			log("warning", "[HMR]  - " + moduleId);
		});
	}

	if (!renewedModules || renewedModules.length === 0) {
		log("info", "[HMR] Nothing hot updated.");
	} else {
		log("info", "[HMR] Updated modules:");
		renewedModules.forEach(function (moduleId) {
			if (typeof moduleId === "string" && moduleId.indexOf("!") !== -1) {
				var parts = moduleId.split("!");
				log.groupCollapsed("info", "[HMR]  - " + parts.pop());
				log("info", "[HMR]  - " + moduleId);
				log.groupEnd("info");
			} else {
				log("info", "[HMR]  - " + moduleId);
			}
		});
		var numberIds = renewedModules.every(function (moduleId) {
			return typeof moduleId === "number";
		});
		if (numberIds)
			log(
				"info",
				'[HMR] Consider using the optimization.moduleIds: "named" for module names.'
			);
	}
};


/***/ }),
/* 3 */
/***/ ((module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const core_1 = __webpack_require__(4);
const app_module_1 = __webpack_require__(5);
const swagger_1 = __webpack_require__(13);
const common_1 = __webpack_require__(6);
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.setGlobalPrefix('api');
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
    }));
    const config = new swagger_1.DocumentBuilder()
        .setTitle('CENTRAL DE REQUERIMIENTOS - LOGINSA')
        .setDescription('API CENTRAL DE REQUERIMIENTOS 2024')
        .setVersion('1.0')
        .addBearerAuth()
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api', app, document);
    app.enableCors();
    await app.listen(3000);
    if (true) {
        module.hot.accept();
        module.hot.dispose(() => app.close());
    }
}
bootstrap();


/***/ }),
/* 4 */
/***/ ((module) => {

"use strict";
module.exports = require("@nestjs/core");

/***/ }),
/* 5 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AppModule = void 0;
const common_1 = __webpack_require__(6);
const typeorm_1 = __webpack_require__(7);
const config_1 = __webpack_require__(8);
const cuenta_empresa_module_1 = __webpack_require__(9);
const centro_module_1 = __webpack_require__(37);
const usuario_module_1 = __webpack_require__(42);
const auth_module_1 = __webpack_require__(28);
const cuenta_module_1 = __webpack_require__(48);
const pais_module_1 = __webpack_require__(53);
const area_module_1 = __webpack_require__(58);
const estados_module_1 = __webpack_require__(64);
const ticket_module_1 = __webpack_require__(69);
const categoria_module_1 = __webpack_require__(74);
const historial_ticket_module_1 = __webpack_require__(79);
const subcategoria_module_1 = __webpack_require__(84);
const perfil_module_1 = __webpack_require__(89);
const menu_nivel1_module_1 = __webpack_require__(98);
const menu_nivel2_module_1 = __webpack_require__(104);
const permisos_module_1 = __webpack_require__(109);
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            typeorm_1.TypeOrmModule.forRoot({
                type: 'postgres',
                host: process.env.DB_HOST,
                port: +process.env.DB_PORT,
                database: process.env.DB_NAME,
                schema: process.env.DB_SCHEMA,
                username: process.env.DB_USER,
                password: process.env.DB_PASSWORD,
                autoLoadEntities: true,
                logging: false,
                synchronize: true,
                ssl: true,
                uuidExtension: 'pgcrypto',
                extra: {
                    ssl: {
                        rejectUnauthorized: false,
                    },
                },
            }),
            cuenta_empresa_module_1.CuentaEmpresaModule,
            centro_module_1.CentroModule,
            usuario_module_1.UsuarioModule,
            auth_module_1.AuthModule,
            cuenta_module_1.CuentaModule,
            pais_module_1.PaisModule,
            area_module_1.AreaModule,
            estados_module_1.EstadosModule,
            ticket_module_1.TicketModule,
            categoria_module_1.CategoriaModule,
            historial_ticket_module_1.HistorialTicketModule,
            subcategoria_module_1.SubcategoriaModule,
            perfil_module_1.PerfilModule,
            menu_nivel1_module_1.MenuNivel1Module,
            menu_nivel2_module_1.MenuNivel2Module,
            permisos_module_1.PermisosModule,
        ],
        controllers: [],
        providers: [],
    })
], AppModule);


/***/ }),
/* 6 */
/***/ ((module) => {

"use strict";
module.exports = require("@nestjs/common");

/***/ }),
/* 7 */
/***/ ((module) => {

"use strict";
module.exports = require("@nestjs/typeorm");

/***/ }),
/* 8 */
/***/ ((module) => {

"use strict";
module.exports = require("@nestjs/config");

/***/ }),
/* 9 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CuentaEmpresaModule = void 0;
const common_1 = __webpack_require__(6);
const cuenta_empresa_service_1 = __webpack_require__(10);
const cuenta_empresa_controller_1 = __webpack_require__(23);
const typeorm_1 = __webpack_require__(7);
const cuenta_empresa_entity_1 = __webpack_require__(12);
const auth_module_1 = __webpack_require__(28);
const cuenta_entity_1 = __webpack_require__(16);
const pais_entity_1 = __webpack_require__(15);
let CuentaEmpresaModule = class CuentaEmpresaModule {
};
exports.CuentaEmpresaModule = CuentaEmpresaModule;
exports.CuentaEmpresaModule = CuentaEmpresaModule = __decorate([
    (0, common_1.Module)({
        controllers: [cuenta_empresa_controller_1.CuentaEmpresaController],
        providers: [cuenta_empresa_service_1.CuentaEmpresaService],
        imports: [typeorm_1.TypeOrmModule.forFeature([cuenta_entity_1.Cuenta, cuenta_empresa_entity_1.CuentaEmpresa, pais_entity_1.Pais]), auth_module_1.AuthModule],
    })
], CuentaEmpresaModule);


/***/ }),
/* 10 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CuentaEmpresaService = void 0;
const common_1 = __webpack_require__(6);
const typeorm_1 = __webpack_require__(7);
const typeorm_2 = __webpack_require__(11);
const cuenta_empresa_entity_1 = __webpack_require__(12);
let CuentaEmpresaService = class CuentaEmpresaService {
    constructor(CuentaEmpresaRepository) {
        this.CuentaEmpresaRepository = CuentaEmpresaRepository;
        this.logger = new common_1.Logger('CuentaEmpresaService');
    }
    async create(createCuentaEmpresaDto) {
        try {
            const CuentaEmpresa = this.CuentaEmpresaRepository.create(createCuentaEmpresaDto);
            await this.CuentaEmpresaRepository.save(CuentaEmpresa);
            return CuentaEmpresa;
        }
        catch (error) {
            this.handleDbExceptions(error);
        }
    }
    async findAll() {
        return this.CuentaEmpresaRepository.find({
            where: { eliminacion: null },
            relations: ["cuenta"]
        });
    }
    async getEmpresasByCuentaId(cuentaId) {
        return this.CuentaEmpresaRepository.find({ where: { cuentaId, eliminacion: null }, relations: ["cuenta"] });
    }
    async findOne(id) {
        const Empresa = await this.CuentaEmpresaRepository.findOneBy({ id });
        if (!Empresa) {
            throw new common_1.NotFoundException('Cuenta Empresa con id: ' + id + ' no encontrado.');
        }
        return Empresa;
    }
    async update(id, updateCuentaEmpresaDto) {
        const CuentaEmpresa = await this.CuentaEmpresaRepository.preload({ id: id, ...updateCuentaEmpresaDto, });
        if (!CuentaEmpresa) {
            throw new common_1.NotFoundException('Cuenta Empresa con id: ' + id + ' no encontrado.');
        }
        try {
            await this.CuentaEmpresaRepository.save(CuentaEmpresa);
            return CuentaEmpresa;
        }
        catch (error) {
            this.handleDbExceptions(error);
        }
    }
    async remove(id) {
        const CuentaEmpresa = await this.CuentaEmpresaRepository.findOneBy({ id });
        if (!CuentaEmpresa) {
            throw new common_1.NotFoundException('Cuenta Empresa con id: ' + id + ' no encontrado.');
        }
        CuentaEmpresa.estado = false;
        CuentaEmpresa.eliminacion = new Date();
        try {
            await this.CuentaEmpresaRepository.save(CuentaEmpresa);
        }
        catch (error) {
            this.handleDbExceptions(error);
        }
    }
    handleDbExceptions(error) {
        if (error.code == 23503) {
            throw new common_1.BadRequestException(error.detail);
        }
        if (error.code == 23502) {
            throw new common_1.BadRequestException('null value in column (' + error.column + ') ' + error.detail);
        }
        this.logger.error(error);
        throw new common_1.InternalServerErrorException('Error inesperado, revisar log');
    }
};
exports.CuentaEmpresaService = CuentaEmpresaService;
exports.CuentaEmpresaService = CuentaEmpresaService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(cuenta_empresa_entity_1.CuentaEmpresa)),
    __metadata("design:paramtypes", [typeof (_a = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _a : Object])
], CuentaEmpresaService);


/***/ }),
/* 11 */
/***/ ((module) => {

"use strict";
module.exports = require("typeorm");

/***/ }),
/* 12 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CuentaEmpresa = void 0;
const swagger_1 = __webpack_require__(13);
const typeorm_1 = __webpack_require__(11);
const centro_entity_1 = __webpack_require__(14);
const cuenta_entity_1 = __webpack_require__(16);
const pais_entity_1 = __webpack_require__(15);
const area_entity_1 = __webpack_require__(18);
const usuario_entity_1 = __webpack_require__(17);
const estado_entity_1 = __webpack_require__(22);
let CuentaEmpresa = class CuentaEmpresa {
};
exports.CuentaEmpresa = CuentaEmpresa;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], CuentaEmpresa.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], CuentaEmpresa.prototype, "nombre", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], CuentaEmpresa.prototype, "razon_social", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], CuentaEmpresa.prototype, "direccion", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], CuentaEmpresa.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], CuentaEmpresa.prototype, "telefono", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)({ type: 'boolean', nullable: true }),
    __metadata("design:type", Boolean)
], CuentaEmpresa.prototype, "estado", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", typeof (_a = typeof Date !== "undefined" && Date) === "function" ? _a : Object)
], CuentaEmpresa.prototype, "eliminacion", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], CuentaEmpresa.prototype, "cuentaId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], CuentaEmpresa.prototype, "paisId", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => centro_entity_1.Centro, (Centro) => Centro.cuentaEmpresa),
    __metadata("design:type", Array)
], CuentaEmpresa.prototype, "centros", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => area_entity_1.Area, (area) => area.empresas),
    __metadata("design:type", Array)
], CuentaEmpresa.prototype, "areas", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => estado_entity_1.Estado, (estado) => estado.empresa),
    __metadata("design:type", Array)
], CuentaEmpresa.prototype, "estados", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => cuenta_entity_1.Cuenta, (Cuenta) => Cuenta.empresas),
    (0, typeorm_1.JoinColumn)({ name: 'cuentaId' }),
    __metadata("design:type", typeof (_b = typeof cuenta_entity_1.Cuenta !== "undefined" && cuenta_entity_1.Cuenta) === "function" ? _b : Object)
], CuentaEmpresa.prototype, "cuenta", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => pais_entity_1.Pais, (Pais) => Pais.empresas),
    (0, typeorm_1.JoinColumn)({ name: 'paisId' }),
    __metadata("design:type", typeof (_c = typeof pais_entity_1.Pais !== "undefined" && pais_entity_1.Pais) === "function" ? _c : Object)
], CuentaEmpresa.prototype, "pais", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => usuario_entity_1.Usuario, (Usuario) => Usuario.empresa),
    __metadata("design:type", Array)
], CuentaEmpresa.prototype, "usuarios", void 0);
exports.CuentaEmpresa = CuentaEmpresa = __decorate([
    (0, typeorm_1.Entity)()
], CuentaEmpresa);


/***/ }),
/* 13 */
/***/ ((module) => {

"use strict";
module.exports = require("@nestjs/swagger");

/***/ }),
/* 14 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Centro = void 0;
const swagger_1 = __webpack_require__(13);
const cuenta_empresa_entity_1 = __webpack_require__(12);
const pais_entity_1 = __webpack_require__(15);
const ticket_entity_1 = __webpack_require__(21);
const usuario_entity_1 = __webpack_require__(17);
const typeorm_1 = __webpack_require__(11);
let Centro = class Centro {
};
exports.Centro = Centro;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Centro.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Centro.prototype, "nombre", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Centro.prototype, "direccion", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Centro.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Centro.prototype, "telefono", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)({ type: 'boolean', nullable: true }),
    __metadata("design:type", Boolean)
], Centro.prototype, "estado", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", typeof (_a = typeof Date !== "undefined" && Date) === "function" ? _a : Object)
], Centro.prototype, "eliminacion", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], Centro.prototype, "cuentaEmpresaId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], Centro.prototype, "paisId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => cuenta_empresa_entity_1.CuentaEmpresa, (CuentaEmpresa) => CuentaEmpresa.centros),
    (0, typeorm_1.JoinColumn)({ name: 'cuentaEmpresaId' }),
    __metadata("design:type", typeof (_b = typeof cuenta_empresa_entity_1.CuentaEmpresa !== "undefined" && cuenta_empresa_entity_1.CuentaEmpresa) === "function" ? _b : Object)
], Centro.prototype, "cuentaEmpresa", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => pais_entity_1.Pais, (Pais) => Pais.empresas),
    (0, typeorm_1.JoinColumn)({ name: 'paisId' }),
    __metadata("design:type", typeof (_c = typeof pais_entity_1.Pais !== "undefined" && pais_entity_1.Pais) === "function" ? _c : Object)
], Centro.prototype, "pais", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => usuario_entity_1.Usuario, (usuario) => usuario.cuenta),
    __metadata("design:type", Array)
], Centro.prototype, "usuarios", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => ticket_entity_1.Ticket, (ticket) => ticket.centro),
    __metadata("design:type", Array)
], Centro.prototype, "tickets", void 0);
exports.Centro = Centro = __decorate([
    (0, typeorm_1.Entity)()
], Centro);


/***/ }),
/* 15 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Pais = void 0;
const swagger_1 = __webpack_require__(13);
const cuenta_empresa_entity_1 = __webpack_require__(12);
const cuenta_entity_1 = __webpack_require__(16);
const typeorm_1 = __webpack_require__(11);
let Pais = class Pais {
};
exports.Pais = Pais;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Pais.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Pais.prototype, "nombre", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Pais.prototype, "codigo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Pais.prototype, "codigo_telefonico", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)({ type: 'boolean', nullable: true }),
    __metadata("design:type", Boolean)
], Pais.prototype, "estado", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", typeof (_a = typeof Date !== "undefined" && Date) === "function" ? _a : Object)
], Pais.prototype, "eliminacion", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => cuenta_empresa_entity_1.CuentaEmpresa, (cuentaEmpresa) => cuentaEmpresa.pais),
    __metadata("design:type", Array)
], Pais.prototype, "empresas", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => cuenta_entity_1.Cuenta, (Cuenta) => Cuenta.pais),
    __metadata("design:type", Array)
], Pais.prototype, "cuentas", void 0);
exports.Pais = Pais = __decorate([
    (0, typeorm_1.Entity)()
], Pais);


/***/ }),
/* 16 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Cuenta = void 0;
const swagger_1 = __webpack_require__(13);
const cuenta_empresa_entity_1 = __webpack_require__(12);
const pais_entity_1 = __webpack_require__(15);
const usuario_entity_1 = __webpack_require__(17);
const typeorm_1 = __webpack_require__(11);
let Cuenta = class Cuenta {
};
exports.Cuenta = Cuenta;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Cuenta.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Cuenta.prototype, "nombre", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Cuenta.prototype, "direccion", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Cuenta.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Cuenta.prototype, "telefono", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)({ type: 'boolean', nullable: true }),
    __metadata("design:type", Boolean)
], Cuenta.prototype, "estado", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", typeof (_a = typeof Date !== "undefined" && Date) === "function" ? _a : Object)
], Cuenta.prototype, "eliminacion", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Cuenta.prototype, "paisId", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => cuenta_empresa_entity_1.CuentaEmpresa, (cuentaEmpresa) => cuentaEmpresa.cuenta),
    __metadata("design:type", Array)
], Cuenta.prototype, "empresas", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => pais_entity_1.Pais, (Pais) => Pais.cuentas),
    (0, typeorm_1.JoinColumn)({ name: 'paisId' }),
    __metadata("design:type", typeof (_b = typeof pais_entity_1.Pais !== "undefined" && pais_entity_1.Pais) === "function" ? _b : Object)
], Cuenta.prototype, "pais", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => usuario_entity_1.Usuario, (usuario) => usuario.cuenta),
    __metadata("design:type", Array)
], Cuenta.prototype, "usuarios", void 0);
exports.Cuenta = Cuenta = __decorate([
    (0, typeorm_1.Entity)()
], Cuenta);


/***/ }),
/* 17 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Usuario = void 0;
const swagger_1 = __webpack_require__(13);
const area_entity_1 = __webpack_require__(18);
const centro_entity_1 = __webpack_require__(14);
const cuenta_empresa_entity_1 = __webpack_require__(12);
const cuenta_entity_1 = __webpack_require__(16);
const ticket_entity_1 = __webpack_require__(21);
const typeorm_1 = __webpack_require__(11);
let Usuario = class Usuario {
};
exports.Usuario = Usuario;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Usuario.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)({ type: 'text', nullable: true, unique: true }),
    __metadata("design:type", String)
], Usuario.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)({ type: 'text', nullable: true, select: false }),
    __metadata("design:type", String)
], Usuario.prototype, "password", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Usuario.prototype, "nombre", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Usuario.prototype, "apellido", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)({ type: 'boolean', nullable: true }),
    __metadata("design:type", Boolean)
], Usuario.prototype, "estado", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", typeof (_a = typeof Date !== "undefined" && Date) === "function" ? _a : Object)
], Usuario.prototype, "eliminacion", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Usuario.prototype, "centroId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Usuario.prototype, "cuentaId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Usuario.prototype, "empresaId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Usuario.prototype, "areaId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => cuenta_entity_1.Cuenta, (cuenta) => cuenta.usuarios),
    (0, typeorm_1.JoinColumn)({ name: 'cuentaId' }),
    __metadata("design:type", typeof (_b = typeof cuenta_entity_1.Cuenta !== "undefined" && cuenta_entity_1.Cuenta) === "function" ? _b : Object)
], Usuario.prototype, "cuenta", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => centro_entity_1.Centro, (centro) => centro.usuarios),
    (0, typeorm_1.JoinColumn)({ name: 'centroId' }),
    __metadata("design:type", typeof (_c = typeof centro_entity_1.Centro !== "undefined" && centro_entity_1.Centro) === "function" ? _c : Object)
], Usuario.prototype, "centro", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => cuenta_empresa_entity_1.CuentaEmpresa, (cuentaEmpresa) => cuentaEmpresa.usuarios),
    (0, typeorm_1.JoinColumn)({ name: 'empresaId' }),
    __metadata("design:type", typeof (_d = typeof cuenta_empresa_entity_1.CuentaEmpresa !== "undefined" && cuenta_empresa_entity_1.CuentaEmpresa) === "function" ? _d : Object)
], Usuario.prototype, "empresa", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => ticket_entity_1.Ticket, (ticket) => ticket.usuario),
    __metadata("design:type", Array)
], Usuario.prototype, "tickets", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => ticket_entity_1.Ticket, (ticketG) => ticketG.usuariosGestion),
    (0, typeorm_1.JoinColumn)({ name: 'ticketGestionId' }),
    __metadata("design:type", Array)
], Usuario.prototype, "ticketsGestion", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => area_entity_1.Area, (area) => area.usuarios),
    (0, typeorm_1.JoinTable)({
        name: 'usuario_area',
        joinColumn: { name: 'usuarioId', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'areaId', referencedColumnName: 'id' },
    }),
    __metadata("design:type", Array)
], Usuario.prototype, "areas", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Array)
], Usuario.prototype, "perfilesPorArea", void 0);
exports.Usuario = Usuario = __decorate([
    (0, typeorm_1.Entity)()
], Usuario);


/***/ }),
/* 18 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Area = void 0;
const swagger_1 = __webpack_require__(13);
const categoria_entity_1 = __webpack_require__(19);
const cuenta_empresa_entity_1 = __webpack_require__(12);
const estado_entity_1 = __webpack_require__(22);
const ticket_entity_1 = __webpack_require__(21);
const usuario_entity_1 = __webpack_require__(17);
const typeorm_1 = __webpack_require__(11);
let Area = class Area {
};
exports.Area = Area;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Area.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Area.prototype, "nombre", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Area.prototype, "descripcion", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Area.prototype, "prefijo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)({ type: 'boolean', nullable: true }),
    __metadata("design:type", Boolean)
], Area.prototype, "estado", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", typeof (_a = typeof Date !== "undefined" && Date) === "function" ? _a : Object)
], Area.prototype, "eliminacion", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Area.prototype, "empresaId", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => cuenta_empresa_entity_1.CuentaEmpresa, (empresa) => empresa.areas),
    (0, typeorm_1.JoinTable)({
        name: 'empresa_area',
    }),
    __metadata("design:type", Array)
], Area.prototype, "empresas", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => estado_entity_1.Estado, (estado) => estado.area),
    __metadata("design:type", Array)
], Area.prototype, "estados", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => ticket_entity_1.Ticket, (ticket) => ticket.area),
    __metadata("design:type", Array)
], Area.prototype, "tickets", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => categoria_entity_1.Categoria, (categoria) => categoria.area),
    __metadata("design:type", Array)
], Area.prototype, "categorias", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => usuario_entity_1.Usuario, (usuario) => usuario.areas),
    __metadata("design:type", Array)
], Area.prototype, "usuarios", void 0);
exports.Area = Area = __decorate([
    (0, typeorm_1.Entity)()
], Area);


/***/ }),
/* 19 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Categoria = void 0;
const swagger_1 = __webpack_require__(13);
const area_entity_1 = __webpack_require__(18);
const subcategoria_entity_1 = __webpack_require__(20);
const ticket_entity_1 = __webpack_require__(21);
const typeorm_1 = __webpack_require__(11);
let Categoria = class Categoria {
};
exports.Categoria = Categoria;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Categoria.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Categoria.prototype, "nombre", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Categoria.prototype, "descripcion", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Categoria.prototype, "icon", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)({ type: 'boolean', nullable: true }),
    __metadata("design:type", Boolean)
], Categoria.prototype, "estado", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", typeof (_a = typeof Date !== "undefined" && Date) === "function" ? _a : Object)
], Categoria.prototype, "eliminacion", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Categoria.prototype, "areaId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)({ type: 'numeric', nullable: true }),
    __metadata("design:type", Number)
], Categoria.prototype, "ticketId", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => ticket_entity_1.Ticket, (ticket) => ticket.categoria),
    __metadata("design:type", Array)
], Categoria.prototype, "tickets", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => area_entity_1.Area, (area) => area.categorias),
    __metadata("design:type", typeof (_b = typeof area_entity_1.Area !== "undefined" && area_entity_1.Area) === "function" ? _b : Object)
], Categoria.prototype, "area", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: () => [subcategoria_entity_1.Subcategoria], description: 'Lista de subcategorías' }),
    (0, typeorm_1.OneToMany)(() => subcategoria_entity_1.Subcategoria, (subcategoria) => subcategoria.categoria),
    __metadata("design:type", Array)
], Categoria.prototype, "subcategorias", void 0);
exports.Categoria = Categoria = __decorate([
    (0, typeorm_1.Entity)()
], Categoria);


/***/ }),
/* 20 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Subcategoria = void 0;
const swagger_1 = __webpack_require__(13);
const categoria_entity_1 = __webpack_require__(19);
const ticket_entity_1 = __webpack_require__(21);
const typeorm_1 = __webpack_require__(11);
let Subcategoria = class Subcategoria {
};
exports.Subcategoria = Subcategoria;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Subcategoria.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Subcategoria.prototype, "nombre", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Subcategoria.prototype, "descripcion", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", typeof (_a = typeof Date !== "undefined" && Date) === "function" ? _a : Object)
], Subcategoria.prototype, "eliminacion", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: () => categoria_entity_1.Categoria }),
    (0, typeorm_1.ManyToOne)(() => categoria_entity_1.Categoria, (categoria) => categoria.subcategorias, {
        nullable: false,
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'categoriaId' }),
    __metadata("design:type", typeof (_b = typeof categoria_entity_1.Categoria !== "undefined" && categoria_entity_1.Categoria) === "function" ? _b : Object)
], Subcategoria.prototype, "categoria", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)({ type: 'number', nullable: true }),
    __metadata("design:type", Number)
], Subcategoria.prototype, "categoriaId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: () => [ticket_entity_1.Ticket],
        description: 'Tickets asociados a esta subcategoría',
    }),
    (0, typeorm_1.OneToMany)(() => ticket_entity_1.Ticket, (ticket) => ticket.subcategoria),
    __metadata("design:type", Array)
], Subcategoria.prototype, "tickets", void 0);
exports.Subcategoria = Subcategoria = __decorate([
    (0, typeorm_1.Entity)()
], Subcategoria);


/***/ }),
/* 21 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b, _c, _d, _e, _f, _g, _h, _j;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Ticket = void 0;
const swagger_1 = __webpack_require__(13);
const area_entity_1 = __webpack_require__(18);
const categoria_entity_1 = __webpack_require__(19);
const centro_entity_1 = __webpack_require__(14);
const estado_entity_1 = __webpack_require__(22);
const subcategoria_entity_1 = __webpack_require__(20);
const usuario_entity_1 = __webpack_require__(17);
const typeorm_1 = __webpack_require__(11);
let Ticket = class Ticket {
};
exports.Ticket = Ticket;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Ticket.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Ticket.prototype, "titulo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Ticket.prototype, "descripcion", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Ticket.prototype, "codigo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Ticket.prototype, "gestionador", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], Ticket.prototype, "areaId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], Ticket.prototype, "usuarioId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)({ type: 'number', nullable: true }),
    __metadata("design:type", Number)
], Ticket.prototype, "estadoId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Ticket.prototype, "centroId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)({ type: 'number', nullable: true }),
    __metadata("design:type", Number)
], Ticket.prototype, "categoriaId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamp' }),
    __metadata("design:type", typeof (_a = typeof Date !== "undefined" && Date) === "function" ? _a : Object)
], Ticket.prototype, "fechaCreacion", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.UpdateDateColumn)({ type: 'timestamp' }),
    __metadata("design:type", typeof (_b = typeof Date !== "undefined" && Date) === "function" ? _b : Object)
], Ticket.prototype, "fechaActualizacion", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => centro_entity_1.Centro, (Centro) => Centro.tickets),
    (0, typeorm_1.JoinColumn)({ name: 'centroId' }),
    __metadata("design:type", typeof (_c = typeof centro_entity_1.Centro !== "undefined" && centro_entity_1.Centro) === "function" ? _c : Object)
], Ticket.prototype, "centro", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => estado_entity_1.Estado, (estado) => estado.tickets),
    (0, typeorm_1.JoinColumn)({ name: 'estadoId' }),
    __metadata("design:type", typeof (_d = typeof estado_entity_1.Estado !== "undefined" && estado_entity_1.Estado) === "function" ? _d : Object)
], Ticket.prototype, "estado", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => usuario_entity_1.Usuario, (usuario) => usuario.tickets),
    (0, typeorm_1.JoinColumn)({ name: 'usuarioId' }),
    __metadata("design:type", typeof (_e = typeof usuario_entity_1.Usuario !== "undefined" && usuario_entity_1.Usuario) === "function" ? _e : Object)
], Ticket.prototype, "usuario", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => area_entity_1.Area, (area) => area.tickets),
    (0, typeorm_1.JoinColumn)({ name: 'areaId' }),
    __metadata("design:type", typeof (_f = typeof area_entity_1.Area !== "undefined" && area_entity_1.Area) === "function" ? _f : Object)
], Ticket.prototype, "area", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => categoria_entity_1.Categoria, (categoria) => categoria.tickets),
    (0, typeorm_1.JoinColumn)({ name: 'categoriaId' }),
    __metadata("design:type", typeof (_g = typeof categoria_entity_1.Categoria !== "undefined" && categoria_entity_1.Categoria) === "function" ? _g : Object)
], Ticket.prototype, "categoria", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => usuario_entity_1.Usuario, (user) => user.ticketsGestion),
    (0, typeorm_1.JoinColumn)({ name: "gestionador" }),
    __metadata("design:type", typeof (_h = typeof usuario_entity_1.Usuario !== "undefined" && usuario_entity_1.Usuario) === "function" ? _h : Object)
], Ticket.prototype, "usuariosGestion", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: () => subcategoria_entity_1.Subcategoria }),
    (0, typeorm_1.ManyToOne)(() => subcategoria_entity_1.Subcategoria, (subcategoria) => subcategoria.tickets, { nullable: true, onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'subcategoriaId' }),
    __metadata("design:type", typeof (_j = typeof subcategoria_entity_1.Subcategoria !== "undefined" && subcategoria_entity_1.Subcategoria) === "function" ? _j : Object)
], Ticket.prototype, "subcategoria", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], Ticket.prototype, "subcategoriaId", void 0);
exports.Ticket = Ticket = __decorate([
    (0, typeorm_1.Entity)()
], Ticket);


/***/ }),
/* 22 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Estado = void 0;
const swagger_1 = __webpack_require__(13);
const area_entity_1 = __webpack_require__(18);
const cuenta_empresa_entity_1 = __webpack_require__(12);
const ticket_entity_1 = __webpack_require__(21);
const typeorm_1 = __webpack_require__(11);
let Estado = class Estado {
};
exports.Estado = Estado;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Estado.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Estado.prototype, "nombre", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Estado.prototype, "descripcion", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Estado.prototype, "codigo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)({ type: 'numeric', nullable: true }),
    __metadata("design:type", Number)
], Estado.prototype, "orden", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)({ type: 'boolean', nullable: true }),
    __metadata("design:type", Boolean)
], Estado.prototype, "estado", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", typeof (_a = typeof Date !== "undefined" && Date) === "function" ? _a : Object)
], Estado.prototype, "eliminacion", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Estado.prototype, "empresaId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Estado.prototype, "areaId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => area_entity_1.Area, (Area) => Area.estados),
    (0, typeorm_1.JoinColumn)({ name: 'areaId' }),
    __metadata("design:type", typeof (_b = typeof area_entity_1.Area !== "undefined" && area_entity_1.Area) === "function" ? _b : Object)
], Estado.prototype, "area", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => cuenta_empresa_entity_1.CuentaEmpresa, (cuentaEmpresa) => cuentaEmpresa.estados),
    (0, typeorm_1.JoinColumn)({ name: 'empresaId' }),
    __metadata("design:type", typeof (_c = typeof cuenta_empresa_entity_1.CuentaEmpresa !== "undefined" && cuenta_empresa_entity_1.CuentaEmpresa) === "function" ? _c : Object)
], Estado.prototype, "empresa", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => ticket_entity_1.Ticket, (ticket) => ticket.estado),
    __metadata("design:type", Array)
], Estado.prototype, "tickets", void 0);
exports.Estado = Estado = __decorate([
    (0, typeorm_1.Entity)()
], Estado);


/***/ }),
/* 23 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CuentaEmpresaController = void 0;
const common_1 = __webpack_require__(6);
const cuenta_empresa_service_1 = __webpack_require__(10);
const create_cuenta_empresa_dto_1 = __webpack_require__(24);
const update_cuenta_empresa_dto_1 = __webpack_require__(26);
const swagger_1 = __webpack_require__(13);
const cuenta_empresa_entity_1 = __webpack_require__(12);
const passport_1 = __webpack_require__(27);
let CuentaEmpresaController = class CuentaEmpresaController {
    constructor(cuentaEmpresaService) {
        this.cuentaEmpresaService = cuentaEmpresaService;
    }
    create(createCuentaEmpresaDto) {
        return this.cuentaEmpresaService.create(createCuentaEmpresaDto);
    }
    findAll() {
        return this.cuentaEmpresaService.findAll();
    }
    async getEmpresasByCuentaId(idCuenta) {
        return this.cuentaEmpresaService.getEmpresasByCuentaId(idCuenta);
    }
    findOne(id) {
        return this.cuentaEmpresaService.findOne(id);
    }
    update(id, updateCuentaEmpresaDto) {
        return this.cuentaEmpresaService.update(id, updateCuentaEmpresaDto);
    }
    remove(id) {
        return this.cuentaEmpresaService.remove(id);
    }
};
exports.CuentaEmpresaController = CuentaEmpresaController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiResponse)({ status: 200, description: "CUENTA CREADA", type: cuenta_empresa_entity_1.CuentaEmpresa }),
    (0, swagger_1.ApiResponse)({ status: 400, description: "CUENTA NO SE PUDO CREAR" }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof create_cuenta_empresa_dto_1.CreateCuentaEmpresaDto !== "undefined" && create_cuenta_empresa_dto_1.CreateCuentaEmpresaDto) === "function" ? _b : Object]),
    __metadata("design:returntype", void 0)
], CuentaEmpresaController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CuentaEmpresaController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('cuenta/:idCuenta'),
    __param(0, (0, common_1.Param)('idCuenta')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CuentaEmpresaController.prototype, "getEmpresasByCuentaId", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CuentaEmpresaController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_c = typeof update_cuenta_empresa_dto_1.UpdateCuentaEmpresaDto !== "undefined" && update_cuenta_empresa_dto_1.UpdateCuentaEmpresaDto) === "function" ? _c : Object]),
    __metadata("design:returntype", void 0)
], CuentaEmpresaController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CuentaEmpresaController.prototype, "remove", null);
exports.CuentaEmpresaController = CuentaEmpresaController = __decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)()),
    (0, swagger_1.ApiTags)("Empresa"),
    (0, common_1.Controller)('empresa'),
    __metadata("design:paramtypes", [typeof (_a = typeof cuenta_empresa_service_1.CuentaEmpresaService !== "undefined" && cuenta_empresa_service_1.CuentaEmpresaService) === "function" ? _a : Object])
], CuentaEmpresaController);


/***/ }),
/* 24 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreateCuentaEmpresaDto = void 0;
const swagger_1 = __webpack_require__(13);
const class_validator_1 = __webpack_require__(25);
class CreateCuentaEmpresaDto {
}
exports.CreateCuentaEmpresaDto = CreateCuentaEmpresaDto;
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateCuentaEmpresaDto.prototype, "nombre", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateCuentaEmpresaDto.prototype, "razon_social", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateCuentaEmpresaDto.prototype, "direccion", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsEmail)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateCuentaEmpresaDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateCuentaEmpresaDto.prototype, "telefono", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreateCuentaEmpresaDto.prototype, "estado", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [String], required: false }),
    (0, class_validator_1.IsUUID)('all', { each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], CreateCuentaEmpresaDto.prototype, "centroIds", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [String], required: false }),
    (0, class_validator_1.IsUUID)('all', { each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], CreateCuentaEmpresaDto.prototype, "areaIds", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateCuentaEmpresaDto.prototype, "cuentaId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateCuentaEmpresaDto.prototype, "paisId", void 0);


/***/ }),
/* 25 */
/***/ ((module) => {

"use strict";
module.exports = require("class-validator");

/***/ }),
/* 26 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UpdateCuentaEmpresaDto = void 0;
const swagger_1 = __webpack_require__(13);
const create_cuenta_empresa_dto_1 = __webpack_require__(24);
class UpdateCuentaEmpresaDto extends (0, swagger_1.PartialType)(create_cuenta_empresa_dto_1.CreateCuentaEmpresaDto) {
}
exports.UpdateCuentaEmpresaDto = UpdateCuentaEmpresaDto;


/***/ }),
/* 27 */
/***/ ((module) => {

"use strict";
module.exports = require("@nestjs/passport");

/***/ }),
/* 28 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthModule = void 0;
const common_1 = __webpack_require__(6);
const auth_service_1 = __webpack_require__(29);
const auth_controller_1 = __webpack_require__(32);
const passport_1 = __webpack_require__(27);
const jwt_1 = __webpack_require__(31);
const config_1 = __webpack_require__(8);
const jwt_strategy_1 = __webpack_require__(35);
const typeorm_1 = __webpack_require__(7);
const usuario_entity_1 = __webpack_require__(17);
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = __decorate([
    (0, common_1.Module)({
        controllers: [auth_controller_1.AuthController],
        providers: [auth_service_1.AuthService, jwt_strategy_1.JwtStrategy, jwt_1.JwtModule],
        imports: [
            config_1.ConfigModule,
            typeorm_1.TypeOrmModule.forFeature([usuario_entity_1.Usuario]),
            passport_1.PassportModule.register({ defaultStrategy: 'jwt' }),
            jwt_1.JwtModule.registerAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (configService) => {
                    return {
                        secret: configService.get('SECRET_KEY'),
                        signOptions: {
                            expiresIn: '24h',
                        },
                    };
                },
            }),
        ],
        exports: [jwt_strategy_1.JwtStrategy, passport_1.PassportModule, jwt_1.JwtModule, typeorm_1.TypeOrmModule],
    })
], AuthModule);


/***/ }),
/* 29 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthService = void 0;
const common_1 = __webpack_require__(6);
const usuario_entity_1 = __webpack_require__(17);
const typeorm_1 = __webpack_require__(7);
const typeorm_2 = __webpack_require__(11);
const bcrypt = __webpack_require__(30);
const jwt_1 = __webpack_require__(31);
let AuthService = class AuthService {
    constructor(UsuarioRepository, jwtService) {
        this.UsuarioRepository = UsuarioRepository;
        this.jwtService = jwtService;
    }
    async create(createAuthDto) {
        const { password, email } = createAuthDto;
        const user = await this.UsuarioRepository.createQueryBuilder('usuario')
            .where('usuario.email = :email', { email })
            .addSelect('usuario.password')
            .distinct(true)
            .getOne();
        console.log(user);
        if (!user) {
            throw new common_1.UnauthorizedException('Correo invalido o no registrado.');
        }
        if (!bcrypt.compareSync(password, user.password)) {
            throw new common_1.UnauthorizedException('Contraseña incorrecta.');
        }
        delete user.password;
        return {
            ...user,
            token: this.getJwtToken({ email: user.email, id: user.id })
        };
    }
    async checkAuthStatus(user) {
        return {
            ...user,
            token: this.getJwtToken({
                id: user.id,
                email: user.email
            })
        };
    }
    getJwtToken(payload) {
        const token = this.jwtService.sign(payload);
        return token;
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(usuario_entity_1.Usuario)),
    __metadata("design:paramtypes", [typeof (_a = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _a : Object, typeof (_b = typeof jwt_1.JwtService !== "undefined" && jwt_1.JwtService) === "function" ? _b : Object])
], AuthService);


/***/ }),
/* 30 */
/***/ ((module) => {

"use strict";
module.exports = require("bcrypt");

/***/ }),
/* 31 */
/***/ ((module) => {

"use strict";
module.exports = require("@nestjs/jwt");

/***/ }),
/* 32 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthController = void 0;
const common_1 = __webpack_require__(6);
const auth_service_1 = __webpack_require__(29);
const create_auth_dto_1 = __webpack_require__(33);
const passport_1 = __webpack_require__(27);
const swagger_1 = __webpack_require__(13);
const usuario_entity_1 = __webpack_require__(17);
const get_user_decorator_1 = __webpack_require__(34);
let AuthController = class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    create(createAuthDto) {
        return this.authService.create(createAuthDto);
    }
    checkAutStatus(user) {
        return this.authService.checkAuthStatus(user);
    }
    testingPrivateRoute() {
        return {
            ok: true,
            message: "privado"
        };
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof create_auth_dto_1.CreateAuthDto !== "undefined" && create_auth_dto_1.CreateAuthDto) === "function" ? _b : Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('check-status'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)()),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_c = typeof usuario_entity_1.Usuario !== "undefined" && usuario_entity_1.Usuario) === "function" ? _c : Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "checkAutStatus", null);
__decorate([
    (0, common_1.Get)('private'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "testingPrivateRoute", null);
exports.AuthController = AuthController = __decorate([
    (0, swagger_1.ApiTags)("Authentication"),
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [typeof (_a = typeof auth_service_1.AuthService !== "undefined" && auth_service_1.AuthService) === "function" ? _a : Object])
], AuthController);


/***/ }),
/* 33 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreateAuthDto = void 0;
const swagger_1 = __webpack_require__(13);
const class_validator_1 = __webpack_require__(25);
class CreateAuthDto {
}
exports.CreateAuthDto = CreateAuthDto;
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], CreateAuthDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAuthDto.prototype, "password", void 0);


/***/ }),
/* 34 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GetUser = void 0;
const common_1 = __webpack_require__(6);
exports.GetUser = (0, common_1.createParamDecorator)((data, ctx) => {
    const req = ctx.switchToHttp().getRequest();
    const user = req.user;
    if (!user) {
        throw new common_1.InternalServerErrorException(' Usuario no encontrado (request)');
    }
    return user;
});


/***/ }),
/* 35 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.JwtStrategy = void 0;
const passport_1 = __webpack_require__(27);
const passport_jwt_1 = __webpack_require__(36);
const usuario_entity_1 = __webpack_require__(17);
const typeorm_1 = __webpack_require__(7);
const typeorm_2 = __webpack_require__(11);
const config_1 = __webpack_require__(8);
const common_1 = __webpack_require__(6);
let JwtStrategy = class JwtStrategy extends (0, passport_1.PassportStrategy)(passport_jwt_1.Strategy) {
    constructor(usuarioRepository, configService) {
        super({
            secretOrKey: configService.get('SECRET_KEY'),
            jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
        });
        this.usuarioRepository = usuarioRepository;
    }
    async validate(payload) {
        const { email, id } = payload;
        const user = await this.usuarioRepository.findOneBy({ email });
        if (!user) {
            throw new common_1.UnauthorizedException("Token no es valido");
        }
        if (!user.estado) {
            throw new common_1.UnauthorizedException("Usuario desactivado");
        }
        return user;
    }
};
exports.JwtStrategy = JwtStrategy;
exports.JwtStrategy = JwtStrategy = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(usuario_entity_1.Usuario)),
    __metadata("design:paramtypes", [typeof (_a = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _a : Object, typeof (_b = typeof config_1.ConfigService !== "undefined" && config_1.ConfigService) === "function" ? _b : Object])
], JwtStrategy);


/***/ }),
/* 36 */
/***/ ((module) => {

"use strict";
module.exports = require("passport-jwt");

/***/ }),
/* 37 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CentroModule = void 0;
const common_1 = __webpack_require__(6);
const centro_service_1 = __webpack_require__(38);
const centro_controller_1 = __webpack_require__(39);
const typeorm_1 = __webpack_require__(7);
const centro_entity_1 = __webpack_require__(14);
const cuenta_empresa_entity_1 = __webpack_require__(12);
const auth_module_1 = __webpack_require__(28);
const pais_entity_1 = __webpack_require__(15);
const ticket_entity_1 = __webpack_require__(21);
let CentroModule = class CentroModule {
};
exports.CentroModule = CentroModule;
exports.CentroModule = CentroModule = __decorate([
    (0, common_1.Module)({
        controllers: [centro_controller_1.CentroController],
        providers: [centro_service_1.CentroService],
        imports: [
            typeorm_1.TypeOrmModule.forFeature([centro_entity_1.Centro, cuenta_empresa_entity_1.CuentaEmpresa, pais_entity_1.Pais, ticket_entity_1.Ticket]),
            auth_module_1.AuthModule
        ],
    })
], CentroModule);


/***/ }),
/* 38 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CentroService = void 0;
const common_1 = __webpack_require__(6);
const typeorm_1 = __webpack_require__(7);
const centro_entity_1 = __webpack_require__(14);
const typeorm_2 = __webpack_require__(11);
let CentroService = class CentroService {
    constructor(CentroRepository) {
        this.CentroRepository = CentroRepository;
        this.logger = new common_1.Logger('CentroService');
    }
    async create(createCentroDto) {
        try {
            const Centro = this.CentroRepository.create(createCentroDto);
            await this.CentroRepository.save(Centro);
            return Centro;
        }
        catch (error) {
            this.handleDbExceptions(error);
        }
    }
    handleDbExceptions(error) {
        if (error.code == 23503) {
            throw new common_1.BadRequestException(error.detail);
        }
        if (error.code == 23502) {
            throw new common_1.BadRequestException('null value in column (' + error.column + ') ' + error.detail);
        }
        this.logger.error(error);
        throw new common_1.InternalServerErrorException('Error inesperado, revisar log');
    }
    async findAll() {
        return this.CentroRepository.find({
            where: { eliminacion: null },
            relations: ['cuentaEmpresa', 'pais']
        });
    }
    async getCentrosByEmpresaId(cuentaEmpresaId) {
        return this.CentroRepository.find({ where: { cuentaEmpresaId, eliminacion: null },
            relations: ['cuentaEmpresa', 'pais'] });
    }
    async findOne(id) {
        const centro = await this.CentroRepository.findOneBy({ id });
        if (!centro) {
            throw new common_1.NotFoundException('Centro con id: ' + id + ' no encontrado.');
        }
        return centro;
    }
    async update(id, updateCentroDto) {
        const centro = await this.CentroRepository.preload({
            id: id,
            ...updateCentroDto,
        });
        if (!centro) {
            throw new common_1.NotFoundException('Centro con id: ' + id + ' no encontrado');
        }
        try {
            await this.CentroRepository.save(centro);
            return centro;
        }
        catch (error) {
            this.handleDbExceptions(error);
        }
    }
    async remove(id) {
        const centro = await this.CentroRepository.findOneBy({ id });
        if (!centro) {
            throw new common_1.NotFoundException('Centro con id: ' + id + ' no encontrado.');
        }
        centro.estado = false;
        centro.eliminacion = new Date();
        try {
            await this.CentroRepository.save(centro);
        }
        catch (error) {
            this.handleDbExceptions(error);
        }
    }
};
exports.CentroService = CentroService;
exports.CentroService = CentroService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(centro_entity_1.Centro)),
    __metadata("design:paramtypes", [typeof (_a = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _a : Object])
], CentroService);


/***/ }),
/* 39 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CentroController = void 0;
const common_1 = __webpack_require__(6);
const centro_service_1 = __webpack_require__(38);
const create_centro_dto_1 = __webpack_require__(40);
const update_centro_dto_1 = __webpack_require__(41);
const swagger_1 = __webpack_require__(13);
const centro_entity_1 = __webpack_require__(14);
const passport_1 = __webpack_require__(27);
let CentroController = class CentroController {
    constructor(centroService) {
        this.centroService = centroService;
    }
    create(createCentroDto) {
        return this.centroService.create(createCentroDto);
    }
    findAll() {
        return this.centroService.findAll();
    }
    async getEmpresasByCuentaId(idEmpresa) {
        return this.centroService.getCentrosByEmpresaId(idEmpresa);
    }
    findOne(id) {
        return this.centroService.findOne(id);
    }
    update(id, updateCentroDto) {
        return this.centroService.update(id, updateCentroDto);
    }
    remove(id) {
        return this.centroService.remove(id);
    }
};
exports.CentroController = CentroController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiResponse)({ status: 200, description: "CENTRO CREADO", type: centro_entity_1.Centro }),
    (0, swagger_1.ApiResponse)({ status: 400, description: "CENTRO NO SE PUDO CREAR" }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof create_centro_dto_1.CreateCentroDto !== "undefined" && create_centro_dto_1.CreateCentroDto) === "function" ? _b : Object]),
    __metadata("design:returntype", void 0)
], CentroController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CentroController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('empresa/:idEmpresa'),
    __param(0, (0, common_1.Param)('idEmpresa')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CentroController.prototype, "getEmpresasByCuentaId", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiResponse)({ status: 200, description: "", type: centro_entity_1.Centro }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "CENTRO NO ENCONTRADO" }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CentroController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_c = typeof update_centro_dto_1.UpdateCentroDto !== "undefined" && update_centro_dto_1.UpdateCentroDto) === "function" ? _c : Object]),
    __metadata("design:returntype", void 0)
], CentroController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CentroController.prototype, "remove", null);
exports.CentroController = CentroController = __decorate([
    (0, swagger_1.ApiTags)('Centros'),
    (0, common_1.Controller)('centro'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)()),
    __metadata("design:paramtypes", [typeof (_a = typeof centro_service_1.CentroService !== "undefined" && centro_service_1.CentroService) === "function" ? _a : Object])
], CentroController);


/***/ }),
/* 40 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreateCentroDto = void 0;
const swagger_1 = __webpack_require__(13);
const class_validator_1 = __webpack_require__(25);
class CreateCentroDto {
}
exports.CreateCentroDto = CreateCentroDto;
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateCentroDto.prototype, "nombre", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateCentroDto.prototype, "direccion", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsEmail)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateCentroDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateCentroDto.prototype, "telefono", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreateCentroDto.prototype, "estado", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateCentroDto.prototype, "cuentaEmpresaId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateCentroDto.prototype, "paisId", void 0);


/***/ }),
/* 41 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UpdateCentroDto = void 0;
const swagger_1 = __webpack_require__(13);
const create_centro_dto_1 = __webpack_require__(40);
class UpdateCentroDto extends (0, swagger_1.PartialType)(create_centro_dto_1.CreateCentroDto) {
}
exports.UpdateCentroDto = UpdateCentroDto;


/***/ }),
/* 42 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UsuarioModule = void 0;
const common_1 = __webpack_require__(6);
const usuario_service_1 = __webpack_require__(43);
const usuario_controller_1 = __webpack_require__(44);
const typeorm_1 = __webpack_require__(7);
const usuario_entity_1 = __webpack_require__(17);
const auth_module_1 = __webpack_require__(28);
const cuenta_entity_1 = __webpack_require__(16);
const cuenta_empresa_entity_1 = __webpack_require__(12);
const ticket_entity_1 = __webpack_require__(21);
const area_entity_1 = __webpack_require__(18);
let UsuarioModule = class UsuarioModule {
};
exports.UsuarioModule = UsuarioModule;
exports.UsuarioModule = UsuarioModule = __decorate([
    (0, common_1.Module)({
        controllers: [usuario_controller_1.UsuarioController],
        providers: [usuario_service_1.UsuarioService],
        exports: [typeorm_1.TypeOrmModule],
        imports: [typeorm_1.TypeOrmModule.forFeature([usuario_entity_1.Usuario, cuenta_entity_1.Cuenta, cuenta_empresa_entity_1.CuentaEmpresa, ticket_entity_1.Ticket, area_entity_1.Area]), auth_module_1.AuthModule],
    })
], UsuarioModule);


/***/ }),
/* 43 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UsuarioService = void 0;
const common_1 = __webpack_require__(6);
const typeorm_1 = __webpack_require__(7);
const typeorm_2 = __webpack_require__(11);
const bcrypt = __webpack_require__(30);
const usuario_entity_1 = __webpack_require__(17);
const cuenta_empresa_entity_1 = __webpack_require__(12);
const area_entity_1 = __webpack_require__(18);
let UsuarioService = class UsuarioService {
    constructor(UsuarioRepository, cuentaEmpresaRepository, areaRepository) {
        this.UsuarioRepository = UsuarioRepository;
        this.cuentaEmpresaRepository = cuentaEmpresaRepository;
        this.areaRepository = areaRepository;
        this.logger = new common_1.Logger('UsuarioService');
    }
    async create(createUsuarioDto) {
        try {
            const { password, empresaId, areaIds, ...userData } = createUsuarioDto;
            let Usuario = this.UsuarioRepository.create({
                ...userData,
                password: bcrypt.hashSync(password, 10),
            });
            if (empresaId) {
                const empresa = await this.cuentaEmpresaRepository.findOne({
                    where: { id: empresaId },
                });
                if (!empresa) {
                    throw new Error(`Empresa con id ${empresaId} no encontrada`);
                }
                Usuario.empresa = empresa;
            }
            if (areaIds && areaIds.length > 0) {
                const areas = await this.areaRepository.find({
                    where: { id: (0, typeorm_2.In)(areaIds) },
                });
                Usuario.areas = areas;
            }
            await this.UsuarioRepository.save(Usuario);
            const { password: removedPassword, ...result } = Usuario;
            return result;
        }
        catch (error) {
            this.handleDbExceptions(error);
        }
    }
    handleDbExceptions(error) {
        if (error.code == 23503) {
            throw new common_1.BadRequestException(error.detail);
        }
        if (error.code == 23502) {
            throw new common_1.BadRequestException('null value in column (' + error.column + ') ' + error.detail);
        }
        this.logger.error(error);
        throw new common_1.InternalServerErrorException('Error inesperado, revisar log');
    }
    async findAll() {
        return this.UsuarioRepository.find({
            where: { eliminacion: null },
            relations: ['cuenta', 'centro', 'empresa'],
        });
    }
    async cambiarPerfilEnArea(usuarioId, dto) {
        const usuario = await this.findOne(usuarioId);
        if (!usuario)
            throw new Error('Usuario no encontrado');
        if (!usuario.perfilesPorArea)
            usuario.perfilesPorArea = [];
        let actualizado = false;
        usuario.perfilesPorArea.forEach(p => {
            if (p.areaIds.includes(dto.areaId)) {
                p.perfilId = dto.perfilId;
                actualizado = true;
            }
        });
        if (!actualizado) {
            usuario.perfilesPorArea.push({ perfilId: dto.perfilId, areaIds: [dto.areaId] });
        }
        return this.UsuarioRepository.save(usuario);
    }
    async getUsuariosByAreaId(areaId) {
        return this.UsuarioRepository.find({
            where: { areaId },
        });
    }
    async getPerfilEnArea(usuarioId, areaId) {
        const usuario = await this.UsuarioRepository.findOne({ where: { id: usuarioId } });
        if (!usuario)
            throw new Error('Usuario no encontrado');
        if (!usuario.perfilesPorArea)
            return null;
        const perfilMapeado = usuario.perfilesPorArea.find(p => p.areaIds.includes(areaId));
        return perfilMapeado ? perfilMapeado.perfilId : null;
    }
    async findOne(id) {
        const Usuario = await this.UsuarioRepository.findOneBy({ id });
        if (!Usuario) {
            throw new common_1.NotFoundException('Usuario con id: ' + id + ' no encontrado');
        }
        return Usuario;
    }
    async update(id, updateUsuarioDto) {
        const Usuario = await this.UsuarioRepository.preload({
            id: id,
            ...updateUsuarioDto,
        });
        if (!Usuario) {
            throw new common_1.NotFoundException('Usuario con id: ' + id + ' no encontrado');
        }
        try {
            await this.UsuarioRepository.save(Usuario);
            return Usuario;
        }
        catch (error) {
            this.handleDbExceptions(error);
        }
    }
    async remove(id) {
        const Usuario = await this.UsuarioRepository.findOneBy({ id });
        if (!Usuario) {
            throw new common_1.NotFoundException('Usuario con id: ' + id + ' no encontrado');
        }
        Usuario.estado = false;
        Usuario.eliminacion = new Date();
        try {
            await this.UsuarioRepository.save(Usuario);
        }
        catch (error) {
            this.handleDbExceptions(error);
        }
    }
};
exports.UsuarioService = UsuarioService;
exports.UsuarioService = UsuarioService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(usuario_entity_1.Usuario)),
    __param(1, (0, typeorm_1.InjectRepository)(cuenta_empresa_entity_1.CuentaEmpresa)),
    __param(2, (0, typeorm_1.InjectRepository)(area_entity_1.Area)),
    __metadata("design:paramtypes", [typeof (_a = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _a : Object, typeof (_b = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _b : Object, typeof (_c = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _c : Object])
], UsuarioService);


/***/ }),
/* 44 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UsuarioController = void 0;
const common_1 = __webpack_require__(6);
const usuario_service_1 = __webpack_require__(43);
const create_usuario_dto_1 = __webpack_require__(45);
const update_usuario_dto_1 = __webpack_require__(46);
const swagger_1 = __webpack_require__(13);
const passport_1 = __webpack_require__(27);
const usuario_entity_1 = __webpack_require__(17);
const upadte_perfil_area_dto_1 = __webpack_require__(47);
let UsuarioController = class UsuarioController {
    constructor(usuarioService) {
        this.usuarioService = usuarioService;
    }
    create(createUsuarioDto) {
        return this.usuarioService.create(createUsuarioDto);
    }
    findAll() {
        return this.usuarioService.findAll();
    }
    async getUsuariosByAreaId(idArea) {
        return this.usuarioService.getUsuariosByAreaId(idArea);
    }
    findOne(id) {
        return this.usuarioService.findOne(id);
    }
    getPerfilEnArea(usuarioId, areaId) {
        return this.usuarioService.getPerfilEnArea(usuarioId, areaId);
    }
    update(id, updateUsuarioDto) {
        return this.usuarioService.update(id, updateUsuarioDto);
    }
    cambiarPerfilArea(usuarioId, dto) {
        return this.usuarioService.cambiarPerfilEnArea(usuarioId, dto);
    }
    remove(id) {
        return this.usuarioService.remove(id);
    }
};
exports.UsuarioController = UsuarioController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiResponse)({ status: 200, description: "USUARIO CREADO", type: usuario_entity_1.Usuario }),
    (0, swagger_1.ApiResponse)({ status: 400, description: "USUARIO NO SE PUDO CREAR" }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof create_usuario_dto_1.CreateUsuarioDto !== "undefined" && create_usuario_dto_1.CreateUsuarioDto) === "function" ? _b : Object]),
    __metadata("design:returntype", void 0)
], UsuarioController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], UsuarioController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('area/:idArea'),
    __param(0, (0, common_1.Param)('idArea')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsuarioController.prototype, "getUsuariosByAreaId", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], UsuarioController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)(':id/perfil-en-area/:areaId'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener el perfil de un usuario en un área específica' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('areaId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], UsuarioController.prototype, "getPerfilEnArea", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_c = typeof update_usuario_dto_1.UpdateUsuarioDto !== "undefined" && update_usuario_dto_1.UpdateUsuarioDto) === "function" ? _c : Object]),
    __metadata("design:returntype", void 0)
], UsuarioController.prototype, "update", null);
__decorate([
    (0, common_1.Patch)(':id/cambiar-perfil-area'),
    (0, swagger_1.ApiBody)({ type: upadte_perfil_area_dto_1.UpdatePerfilAreaDto }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_d = typeof upadte_perfil_area_dto_1.UpdatePerfilAreaDto !== "undefined" && upadte_perfil_area_dto_1.UpdatePerfilAreaDto) === "function" ? _d : Object]),
    __metadata("design:returntype", void 0)
], UsuarioController.prototype, "cambiarPerfilArea", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], UsuarioController.prototype, "remove", null);
exports.UsuarioController = UsuarioController = __decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)()),
    (0, swagger_1.ApiTags)("Usuario"),
    (0, common_1.Controller)('usuario'),
    __metadata("design:paramtypes", [typeof (_a = typeof usuario_service_1.UsuarioService !== "undefined" && usuario_service_1.UsuarioService) === "function" ? _a : Object])
], UsuarioController);


/***/ }),
/* 45 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreateUsuarioDto = void 0;
const swagger_1 = __webpack_require__(13);
const class_validator_1 = __webpack_require__(25);
class CreateUsuarioDto {
}
exports.CreateUsuarioDto = CreateUsuarioDto;
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateUsuarioDto.prototype, "nombre", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateUsuarioDto.prototype, "apellido", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsEmail)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateUsuarioDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateUsuarioDto.prototype, "password", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreateUsuarioDto.prototype, "estado", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateUsuarioDto.prototype, "cuentaId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateUsuarioDto.prototype, "centroId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateUsuarioDto.prototype, "empresaId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsUUID)("all", { each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], CreateUsuarioDto.prototype, "areaIds", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Lista de perfiles por área",
        example: [
            { perfilId: "4", areaIds: ["uuid-area1", "uuid-area2"] },
            { perfilId: "5", areaIds: ["uuid-area3"] },
        ],
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], CreateUsuarioDto.prototype, "perfilesPorArea", void 0);


/***/ }),
/* 46 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UpdateUsuarioDto = void 0;
const swagger_1 = __webpack_require__(13);
const create_usuario_dto_1 = __webpack_require__(45);
class UpdateUsuarioDto extends (0, swagger_1.PartialType)(create_usuario_dto_1.CreateUsuarioDto) {
}
exports.UpdateUsuarioDto = UpdateUsuarioDto;


/***/ }),
/* 47 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UpdatePerfilAreaDto = void 0;
const class_validator_1 = __webpack_require__(25);
const swagger_1 = __webpack_require__(13);
class UpdatePerfilAreaDto {
}
exports.UpdatePerfilAreaDto = UpdatePerfilAreaDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ID del perfil a asignar' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdatePerfilAreaDto.prototype, "perfilId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ID del área donde se cambiará el perfil' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdatePerfilAreaDto.prototype, "areaId", void 0);


/***/ }),
/* 48 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CuentaModule = void 0;
const common_1 = __webpack_require__(6);
const cuenta_service_1 = __webpack_require__(49);
const cuenta_controller_1 = __webpack_require__(50);
const typeorm_1 = __webpack_require__(7);
const cuenta_entity_1 = __webpack_require__(16);
const auth_module_1 = __webpack_require__(28);
const pais_entity_1 = __webpack_require__(15);
const cuenta_empresa_entity_1 = __webpack_require__(12);
const usuario_entity_1 = __webpack_require__(17);
let CuentaModule = class CuentaModule {
};
exports.CuentaModule = CuentaModule;
exports.CuentaModule = CuentaModule = __decorate([
    (0, common_1.Module)({
        controllers: [cuenta_controller_1.CuentaController],
        providers: [cuenta_service_1.CuentaService],
        imports: [typeorm_1.TypeOrmModule.forFeature([cuenta_entity_1.Cuenta, pais_entity_1.Pais, cuenta_empresa_entity_1.CuentaEmpresa, usuario_entity_1.Usuario]), auth_module_1.AuthModule],
    })
], CuentaModule);


/***/ }),
/* 49 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CuentaService = void 0;
const common_1 = __webpack_require__(6);
const typeorm_1 = __webpack_require__(11);
const cuenta_entity_1 = __webpack_require__(16);
const typeorm_2 = __webpack_require__(7);
let CuentaService = class CuentaService {
    constructor(CuentaRepository) {
        this.CuentaRepository = CuentaRepository;
        this.logger = new common_1.Logger('CuentaService');
    }
    async create(createCuentaDto) {
        try {
            const Cuenta = this.CuentaRepository.create(createCuentaDto);
            await this.CuentaRepository.save(Cuenta);
            return Cuenta;
        }
        catch (error) {
            this.handleDbExceptions(error);
        }
    }
    handleDbExceptions(error) {
        if (error.code == 23503) {
            throw new common_1.BadRequestException(error.detail);
        }
        if (error.code == 23502) {
            throw new common_1.BadRequestException('null value in column (' + error.column + ') ' + error.detail);
        }
        this.logger.error(error);
        throw new common_1.InternalServerErrorException('Error inesperado, revisar log');
    }
    async findAll() {
        return this.CuentaRepository.find({
            where: { eliminacion: null },
            relations: ['empresas']
        });
    }
    async findOne(id) {
        const cuenta = await this.CuentaRepository.findOneBy({ id });
        if (!cuenta) {
            throw new common_1.NotFoundException('Cuenta con id: ' + id + ' no encontrado.');
        }
        return cuenta;
    }
    async update(id, updateCuentaDto) {
        const cuenta = await this.CuentaRepository.preload({
            id: id,
            ...updateCuentaDto,
        });
        if (!cuenta) {
            throw new common_1.NotFoundException('Cuenta con id: ' + id + ' no encontrado');
        }
        try {
            await this.CuentaRepository.save(cuenta);
            return cuenta;
        }
        catch (error) {
            this.handleDbExceptions(error);
        }
    }
    async remove(id) {
        const cuenta = await this.CuentaRepository.findOneBy({ id });
        if (!cuenta) {
            throw new common_1.NotFoundException('Cuenta con id: ' + id + ' no encontrado.');
        }
        cuenta.estado = false;
        cuenta.eliminacion = new Date();
        try {
            await this.CuentaRepository.save(cuenta);
        }
        catch (error) {
            this.handleDbExceptions(error);
        }
    }
};
exports.CuentaService = CuentaService;
exports.CuentaService = CuentaService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_2.InjectRepository)(cuenta_entity_1.Cuenta)),
    __metadata("design:paramtypes", [typeof (_a = typeof typeorm_1.Repository !== "undefined" && typeorm_1.Repository) === "function" ? _a : Object])
], CuentaService);


/***/ }),
/* 50 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CuentaController = void 0;
const common_1 = __webpack_require__(6);
const cuenta_service_1 = __webpack_require__(49);
const create_cuenta_dto_1 = __webpack_require__(51);
const update_cuenta_dto_1 = __webpack_require__(52);
const swagger_1 = __webpack_require__(13);
const passport_1 = __webpack_require__(27);
const cuenta_entity_1 = __webpack_require__(16);
let CuentaController = class CuentaController {
    constructor(cuentaService) {
        this.cuentaService = cuentaService;
    }
    create(createCuentaDto) {
        return this.cuentaService.create(createCuentaDto);
    }
    findAll() {
        return this.cuentaService.findAll();
    }
    findOne(id) {
        return this.cuentaService.findOne(id);
    }
    update(id, updateCuentaDto) {
        return this.cuentaService.update(id, updateCuentaDto);
    }
    remove(id) {
        return this.cuentaService.remove(id);
    }
};
exports.CuentaController = CuentaController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiResponse)({ status: 200, description: "CUENTA CREADA", type: cuenta_entity_1.Cuenta }),
    (0, swagger_1.ApiResponse)({ status: 400, description: "CUENTA NO SE PUDO CREAR" }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof create_cuenta_dto_1.CreateCuentaDto !== "undefined" && create_cuenta_dto_1.CreateCuentaDto) === "function" ? _b : Object]),
    __metadata("design:returntype", void 0)
], CuentaController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CuentaController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CuentaController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_c = typeof update_cuenta_dto_1.UpdateCuentaDto !== "undefined" && update_cuenta_dto_1.UpdateCuentaDto) === "function" ? _c : Object]),
    __metadata("design:returntype", void 0)
], CuentaController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CuentaController.prototype, "remove", null);
exports.CuentaController = CuentaController = __decorate([
    (0, swagger_1.ApiTags)('Cuentas'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)()),
    (0, common_1.Controller)('cuenta'),
    __metadata("design:paramtypes", [typeof (_a = typeof cuenta_service_1.CuentaService !== "undefined" && cuenta_service_1.CuentaService) === "function" ? _a : Object])
], CuentaController);


/***/ }),
/* 51 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreateCuentaDto = void 0;
const swagger_1 = __webpack_require__(13);
const class_validator_1 = __webpack_require__(25);
class CreateCuentaDto {
}
exports.CreateCuentaDto = CreateCuentaDto;
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateCuentaDto.prototype, "nombre", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateCuentaDto.prototype, "direccion", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsEmail)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateCuentaDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateCuentaDto.prototype, "telefono", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreateCuentaDto.prototype, "estado", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [String], required: false }),
    (0, class_validator_1.IsUUID)('all', { each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], CreateCuentaDto.prototype, "empresasIds", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateCuentaDto.prototype, "paisId", void 0);


/***/ }),
/* 52 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UpdateCuentaDto = void 0;
const swagger_1 = __webpack_require__(13);
const create_cuenta_dto_1 = __webpack_require__(51);
class UpdateCuentaDto extends (0, swagger_1.PartialType)(create_cuenta_dto_1.CreateCuentaDto) {
}
exports.UpdateCuentaDto = UpdateCuentaDto;


/***/ }),
/* 53 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PaisModule = void 0;
const common_1 = __webpack_require__(6);
const pais_service_1 = __webpack_require__(54);
const pais_controller_1 = __webpack_require__(55);
const typeorm_1 = __webpack_require__(7);
const auth_module_1 = __webpack_require__(28);
const pais_entity_1 = __webpack_require__(15);
let PaisModule = class PaisModule {
};
exports.PaisModule = PaisModule;
exports.PaisModule = PaisModule = __decorate([
    (0, common_1.Module)({
        controllers: [pais_controller_1.PaisController],
        providers: [pais_service_1.PaisService],
        imports: [typeorm_1.TypeOrmModule.forFeature([pais_entity_1.Pais]), auth_module_1.AuthModule],
    })
], PaisModule);


/***/ }),
/* 54 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PaisService = void 0;
const common_1 = __webpack_require__(6);
const typeorm_1 = __webpack_require__(7);
const pais_entity_1 = __webpack_require__(15);
const typeorm_2 = __webpack_require__(11);
let PaisService = class PaisService {
    constructor(PaisRepository) {
        this.PaisRepository = PaisRepository;
        this.logger = new common_1.Logger('PaisService');
    }
    async create(createPaisDto) {
        try {
            const Pais = this.PaisRepository.create(createPaisDto);
            await this.PaisRepository.save(Pais);
            return Pais;
        }
        catch (error) {
            this.handleDbExceptions(error);
        }
    }
    findAll() {
        return this.PaisRepository.find({
            where: { eliminacion: null },
            relations: ['empresas', 'cuentas']
        });
    }
    async findOne(id) {
        const Pais = await this.PaisRepository.findOneBy({ id });
        if (!Pais) {
            throw new common_1.NotFoundException('Pais con id: ' + id + ' no encontrado.');
        }
        return Pais;
    }
    async update(id, updatePaisDto) {
        const Pais = await this.PaisRepository.preload({ id: id, ...updatePaisDto, });
        if (!Pais) {
            throw new common_1.NotFoundException(' Pais con id: ' + id + ' no encontrado');
        }
        try {
            await this.PaisRepository.save(Pais);
            return Pais;
        }
        catch (error) {
            this.handleDbExceptions(error);
        }
    }
    async remove(id) {
        const Pais = await this.PaisRepository.findOneBy({ id });
        if (!Pais) {
            throw new common_1.NotFoundException(' Pais con id: ' + id + ' no encontrado.');
        }
        Pais.estado = false;
        Pais.eliminacion = new Date();
        try {
            await this.PaisRepository.save(Pais);
        }
        catch (error) {
            this.handleDbExceptions(error);
        }
    }
    handleDbExceptions(error) {
        if (error.code == 23503) {
            throw new common_1.BadRequestException(error.detail);
        }
        if (error.code == 23502) {
            throw new common_1.BadRequestException('null value in column (' + error.column + ') ' + error.detail);
        }
        this.logger.error(error);
        throw new common_1.InternalServerErrorException('Error inesperado, revisar log');
    }
};
exports.PaisService = PaisService;
exports.PaisService = PaisService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(pais_entity_1.Pais)),
    __metadata("design:paramtypes", [typeof (_a = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _a : Object])
], PaisService);


/***/ }),
/* 55 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PaisController = void 0;
const common_1 = __webpack_require__(6);
const pais_service_1 = __webpack_require__(54);
const create_pais_dto_1 = __webpack_require__(56);
const update_pais_dto_1 = __webpack_require__(57);
const swagger_1 = __webpack_require__(13);
const passport_1 = __webpack_require__(27);
const pais_entity_1 = __webpack_require__(15);
let PaisController = class PaisController {
    constructor(paisService) {
        this.paisService = paisService;
    }
    create(createPaisDto) {
        return this.paisService.create(createPaisDto);
    }
    findAll() {
        return this.paisService.findAll();
    }
    findOne(id) {
        return this.paisService.findOne(id);
    }
    update(id, updatePaiDto) {
        return this.paisService.update(id, updatePaiDto);
    }
    remove(id) {
        return this.paisService.remove(id);
    }
};
exports.PaisController = PaisController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiResponse)({ status: 200, description: "PAIS CREADO", type: pais_entity_1.Pais }),
    (0, swagger_1.ApiResponse)({ status: 400, description: "PAIS NO SE PUDO CREAR" }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof create_pais_dto_1.CreatePaisDto !== "undefined" && create_pais_dto_1.CreatePaisDto) === "function" ? _b : Object]),
    __metadata("design:returntype", void 0)
], PaisController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PaisController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PaisController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_c = typeof update_pais_dto_1.UpdatePaisDto !== "undefined" && update_pais_dto_1.UpdatePaisDto) === "function" ? _c : Object]),
    __metadata("design:returntype", void 0)
], PaisController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PaisController.prototype, "remove", null);
exports.PaisController = PaisController = __decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)()),
    (0, swagger_1.ApiTags)('Pais'),
    (0, common_1.Controller)('pais'),
    __metadata("design:paramtypes", [typeof (_a = typeof pais_service_1.PaisService !== "undefined" && pais_service_1.PaisService) === "function" ? _a : Object])
], PaisController);


/***/ }),
/* 56 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreatePaisDto = void 0;
const swagger_1 = __webpack_require__(13);
const class_validator_1 = __webpack_require__(25);
class CreatePaisDto {
}
exports.CreatePaisDto = CreatePaisDto;
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreatePaisDto.prototype, "nombre", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreatePaisDto.prototype, "codigo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreatePaisDto.prototype, "codigo_telefonico", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreatePaisDto.prototype, "estado", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [String], required: false }),
    (0, class_validator_1.IsUUID)('all', { each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], CreatePaisDto.prototype, "empresasIds", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [String], required: false }),
    (0, class_validator_1.IsUUID)('all', { each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], CreatePaisDto.prototype, "cuentasIds", void 0);


/***/ }),
/* 57 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UpdatePaisDto = void 0;
const swagger_1 = __webpack_require__(13);
const create_pais_dto_1 = __webpack_require__(56);
class UpdatePaisDto extends (0, swagger_1.PartialType)(create_pais_dto_1.CreatePaisDto) {
}
exports.UpdatePaisDto = UpdatePaisDto;


/***/ }),
/* 58 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AreaModule = void 0;
const common_1 = __webpack_require__(6);
const area_service_1 = __webpack_require__(59);
const area_controller_1 = __webpack_require__(60);
const typeorm_1 = __webpack_require__(7);
const area_entity_1 = __webpack_require__(18);
const cuenta_empresa_entity_1 = __webpack_require__(12);
const auth_module_1 = __webpack_require__(28);
const ticket_entity_1 = __webpack_require__(21);
const usuario_entity_1 = __webpack_require__(17);
const cuenta_entity_1 = __webpack_require__(16);
let AreaModule = class AreaModule {
};
exports.AreaModule = AreaModule;
exports.AreaModule = AreaModule = __decorate([
    (0, common_1.Module)({
        controllers: [area_controller_1.AreaController],
        providers: [area_service_1.AreaService],
        exports: [typeorm_1.TypeOrmModule],
        imports: [typeorm_1.TypeOrmModule.forFeature([usuario_entity_1.Usuario, cuenta_entity_1.Cuenta, cuenta_empresa_entity_1.CuentaEmpresa, ticket_entity_1.Ticket, area_entity_1.Area]), auth_module_1.AuthModule],
    })
], AreaModule);


/***/ }),
/* 59 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AreaService = void 0;
const common_1 = __webpack_require__(6);
const typeorm_1 = __webpack_require__(7);
const typeorm_2 = __webpack_require__(11);
const area_entity_1 = __webpack_require__(18);
const cuenta_empresa_entity_1 = __webpack_require__(12);
const usuario_entity_1 = __webpack_require__(17);
let AreaService = class AreaService {
    constructor(AreaRepository, empresaRepository, usuarioRepository) {
        this.AreaRepository = AreaRepository;
        this.empresaRepository = empresaRepository;
        this.usuarioRepository = usuarioRepository;
        this.logger = new common_1.Logger('AreaService');
    }
    async create(createAreaDto) {
        try {
            const Area = this.AreaRepository.create(createAreaDto);
            await this.AreaRepository.save(Area);
            return Area;
        }
        catch (error) {
            this.handleDbExceptions(error);
        }
    }
    async findAll() {
        return this.AreaRepository.createQueryBuilder('area')
            .leftJoinAndSelect('area.empresas', 'empresa')
            .where('area.eliminacion IS NULL')
            .getMany();
    }
    async getAreaByEmpresaId(empresaId) {
        return this.AreaRepository.createQueryBuilder('area')
            .leftJoinAndSelect('area.empresas', 'empresa')
            .where('empresa.id = :empresaId', { empresaId })
            .andWhere('area.eliminacion IS NULL')
            .getMany();
    }
    async findOne(id) {
        const Area = await this.AreaRepository.findOneBy({ id });
        if (!Area) {
            throw new common_1.NotFoundException('Area con id: ' + id + ' no encontrada');
        }
        return Area;
    }
    async update(id, updateAreaDto) {
        const area = await this.AreaRepository.preload({ id: id, ...updateAreaDto, });
        if (!area) {
            throw new common_1.NotFoundException('Area con id: ' + id + ' no encontrada.');
        }
        try {
            await this.AreaRepository.save(area);
            return area;
        }
        catch (error) {
            this.handleDbExceptions(error);
        }
    }
    async remove(id) {
        const Area = await this.AreaRepository.findOneBy({ id });
        if (!Area) {
            throw new common_1.NotFoundException('Area con id: ' + id + ' no encontrada');
        }
        Area.estado = false;
        Area.eliminacion = new Date();
        try {
            await this.AreaRepository.save(Area);
        }
        catch (error) {
            this.handleDbExceptions(error);
        }
    }
    async createAreaConEmpresas(createAreaDto, empresaIds) {
        const empresas = await this.empresaRepository.findByIds(empresaIds);
        if (empresas.length !== empresaIds.length) {
            throw new common_1.NotFoundException('Una o más empresas no existen');
        }
        const area = this.AreaRepository.create({
            ...createAreaDto,
            empresas,
        });
        return await this.AreaRepository.save(area);
    }
    async updateAreaConEmpresas(id, updateAreaDto, empresaIds) {
        const empresas = await this.empresaRepository.findByIds(empresaIds);
        if (empresas.length !== empresaIds.length) {
            throw new common_1.NotFoundException('Una o más empresas no existen');
        }
        const area = await this.AreaRepository.preload({
            id,
            ...updateAreaDto,
            empresas,
        });
        if (!area) {
            throw new common_1.NotFoundException(`Área con id ${id} no encontrada.`);
        }
        try {
            return await this.AreaRepository.save(area);
        }
        catch (error) {
            this.handleDbExceptions(error);
        }
    }
    async obtenerAreasPorUsuario(usuarioId) {
        const usuario = await this.usuarioRepository.findOne({
            where: { id: usuarioId },
            relations: ['areas'],
        });
        if (!usuario)
            return [];
        return usuario.areas;
    }
    handleDbExceptions(error) {
        if (error.code == 23503) {
            throw new common_1.BadRequestException(error.detail);
        }
        if (error.code == 23502) {
            throw new common_1.BadRequestException('null value in column (' + error.column + ') ' + error.detail);
        }
        this.logger.error(error);
        throw new common_1.InternalServerErrorException('Error inesperado, revisar log');
    }
};
exports.AreaService = AreaService;
exports.AreaService = AreaService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(area_entity_1.Area)),
    __param(1, (0, typeorm_1.InjectRepository)(cuenta_empresa_entity_1.CuentaEmpresa)),
    __param(2, (0, typeorm_1.InjectRepository)(usuario_entity_1.Usuario)),
    __metadata("design:paramtypes", [typeof (_a = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _a : Object, typeof (_b = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _b : Object, typeof (_c = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _c : Object])
], AreaService);


/***/ }),
/* 60 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c, _d, _e, _f;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AreaController = void 0;
const common_1 = __webpack_require__(6);
const area_service_1 = __webpack_require__(59);
const create_area_dto_1 = __webpack_require__(61);
const update_area_dto_1 = __webpack_require__(62);
const update_areaEmpresa_dto_1 = __webpack_require__(63);
const swagger_1 = __webpack_require__(13);
const passport_1 = __webpack_require__(27);
const area_entity_1 = __webpack_require__(18);
let AreaController = class AreaController {
    constructor(areaService) {
        this.areaService = areaService;
    }
    create(createAreaDto) {
        return this.areaService.create(createAreaDto);
    }
    async createArea(createAreaDto) {
        const { nombre, empresaIds } = createAreaDto;
        return this.areaService.createAreaConEmpresas(createAreaDto, empresaIds);
    }
    findAll() {
        return this.areaService.findAll();
    }
    async getAreaByEmpresaId(idEmpresa) {
        return this.areaService.getAreaByEmpresaId(idEmpresa);
    }
    findOne(id) {
        return this.areaService.findOne(id);
    }
    async obtenerAreasUsuario(usuarioId) {
        return this.areaService.obtenerAreasPorUsuario(usuarioId);
    }
    update(id, updateAreaDto) {
        return this.areaService.update(id, updateAreaDto);
    }
    async updateAreaConEmpresas(id, dto) {
        const { empresaIds, ...updateAreaDto } = dto;
        return this.areaService.updateAreaConEmpresas(id, updateAreaDto, empresaIds);
    }
    remove(id) {
        return this.areaService.remove(id);
    }
};
exports.AreaController = AreaController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiResponse)({ status: 200, description: "AREA CREADA", type: area_entity_1.Area }),
    (0, swagger_1.ApiResponse)({ status: 400, description: "AREA NO SE PUDO CREAR" }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof create_area_dto_1.CreateAreaDto !== "undefined" && create_area_dto_1.CreateAreaDto) === "function" ? _b : Object]),
    __metadata("design:returntype", void 0)
], AreaController.prototype, "create", null);
__decorate([
    (0, common_1.Post)('empresa'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_c = typeof create_area_dto_1.CreateAreaDto !== "undefined" && create_area_dto_1.CreateAreaDto) === "function" ? _c : Object]),
    __metadata("design:returntype", Promise)
], AreaController.prototype, "createArea", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AreaController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('empresa/:idEmpresa'),
    __param(0, (0, common_1.Param)('idEmpresa')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AreaController.prototype, "getAreaByEmpresaId", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AreaController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)('usuario/:usuarioId'),
    __param(0, (0, common_1.Param)('usuarioId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", typeof (_d = typeof Promise !== "undefined" && Promise) === "function" ? _d : Object)
], AreaController.prototype, "obtenerAreasUsuario", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_e = typeof update_area_dto_1.UpdateAreaDto !== "undefined" && update_area_dto_1.UpdateAreaDto) === "function" ? _e : Object]),
    __metadata("design:returntype", void 0)
], AreaController.prototype, "update", null);
__decorate([
    (0, common_1.Patch)('empresa/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_f = typeof update_areaEmpresa_dto_1.UpdateAreaWithEmpresasDto !== "undefined" && update_areaEmpresa_dto_1.UpdateAreaWithEmpresasDto) === "function" ? _f : Object]),
    __metadata("design:returntype", Promise)
], AreaController.prototype, "updateAreaConEmpresas", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AreaController.prototype, "remove", null);
exports.AreaController = AreaController = __decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)()),
    (0, swagger_1.ApiTags)("Area"),
    (0, common_1.Controller)('area'),
    __metadata("design:paramtypes", [typeof (_a = typeof area_service_1.AreaService !== "undefined" && area_service_1.AreaService) === "function" ? _a : Object])
], AreaController);


/***/ }),
/* 61 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreateAreaDto = void 0;
const swagger_1 = __webpack_require__(13);
const class_validator_1 = __webpack_require__(25);
class CreateAreaDto {
}
exports.CreateAreaDto = CreateAreaDto;
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateAreaDto.prototype, "nombre", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateAreaDto.prototype, "descripcion", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreateAreaDto.prototype, "estado", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateAreaDto.prototype, "prefijo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [String], required: false, description: 'IDs de empresas existentes' }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], CreateAreaDto.prototype, "empresaIds", void 0);


/***/ }),
/* 62 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UpdateAreaDto = void 0;
const swagger_1 = __webpack_require__(13);
const create_area_dto_1 = __webpack_require__(61);
class UpdateAreaDto extends (0, swagger_1.PartialType)(create_area_dto_1.CreateAreaDto) {
}
exports.UpdateAreaDto = UpdateAreaDto;


/***/ }),
/* 63 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UpdateAreaWithEmpresasDto = void 0;
const swagger_1 = __webpack_require__(13);
const update_area_dto_1 = __webpack_require__(62);
class UpdateAreaWithEmpresasDto extends (0, swagger_1.PartialType)(update_area_dto_1.UpdateAreaDto) {
}
exports.UpdateAreaWithEmpresasDto = UpdateAreaWithEmpresasDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        type: [String],
        description: 'Lista de IDs de empresas asociadas al área',
        example: ['uuid-empresa-1', 'uuid-empresa-2'],
    }),
    __metadata("design:type", Array)
], UpdateAreaWithEmpresasDto.prototype, "empresaIds", void 0);


/***/ }),
/* 64 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EstadosModule = void 0;
const common_1 = __webpack_require__(6);
const estados_service_1 = __webpack_require__(65);
const estados_controller_1 = __webpack_require__(66);
const typeorm_1 = __webpack_require__(7);
const area_entity_1 = __webpack_require__(18);
const auth_module_1 = __webpack_require__(28);
const estado_entity_1 = __webpack_require__(22);
const cuenta_empresa_entity_1 = __webpack_require__(12);
const ticket_entity_1 = __webpack_require__(21);
let EstadosModule = class EstadosModule {
};
exports.EstadosModule = EstadosModule;
exports.EstadosModule = EstadosModule = __decorate([
    (0, common_1.Module)({
        controllers: [estados_controller_1.EstadosController],
        providers: [estados_service_1.EstadosService],
        imports: [typeorm_1.TypeOrmModule.forFeature([area_entity_1.Area, estado_entity_1.Estado, cuenta_empresa_entity_1.CuentaEmpresa, ticket_entity_1.Ticket]), auth_module_1.AuthModule]
    })
], EstadosModule);


/***/ }),
/* 65 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EstadosService = void 0;
const common_1 = __webpack_require__(6);
const typeorm_1 = __webpack_require__(7);
const estado_entity_1 = __webpack_require__(22);
const typeorm_2 = __webpack_require__(11);
let EstadosService = class EstadosService {
    constructor(EstadoRepository) {
        this.EstadoRepository = EstadoRepository;
        this.logger = new common_1.Logger('EstadosService');
    }
    async create(createEstadoDto) {
        try {
            const Estado = this.EstadoRepository.create(createEstadoDto);
            await this.EstadoRepository.save(Estado);
            return Estado;
        }
        catch (error) {
            this.handleDbExceptions(error);
        }
    }
    findAll() {
        return this.EstadoRepository.find({
            where: { eliminacion: null },
            relations: ['empresa', 'area'],
        });
    }
    async findOne(id) {
        const estado = await this.EstadoRepository.findOneBy({ id });
        if (!estado) {
            throw new common_1.NotFoundException('Estado con id: ' + id + ' no encontrado');
        }
        return estado;
    }
    async getEstadosByArea(areaId) {
        return this.EstadoRepository.find({
            where: { area: { id: areaId } },
        });
    }
    async getEstadosByEmpresa(empresaId) {
        return this.EstadoRepository.find({
            where: { empresa: { id: empresaId } },
        });
    }
    async getEstadosByAreaAndEmpresa(areaId, empresaId) {
        return this.EstadoRepository.createQueryBuilder('estado')
            .where('estado.empresaId = :empresaId', { empresaId })
            .andWhere(new typeorm_2.Brackets((qb) => {
            qb.where('estado.areaId = :areaId', { areaId }).orWhere('estado.areaId IS NULL');
        }))
            .getMany();
    }
    async update(id, updateEstadoDto) {
        const estado = await this.EstadoRepository.preload({
            id: id,
            ...updateEstadoDto,
        });
        if (!estado) {
            throw new common_1.NotFoundException('Estado con id: ' + id + ' no encontrado.');
        }
        try {
            await this.EstadoRepository.save(estado);
            return estado;
        }
        catch (error) {
            this.handleDbExceptions(error);
        }
    }
    async remove(id) {
        const estado = await this.EstadoRepository.findOneBy({ id });
        if (!estado) {
            throw new common_1.NotFoundException('Estado con id: ' + id + ' no encontrado');
        }
        estado.estado = false;
        estado.eliminacion = new Date();
        try {
            await this.EstadoRepository.save(estado);
        }
        catch (error) {
            this.handleDbExceptions(error);
        }
    }
    handleDbExceptions(error) {
        if (error.code == 23503) {
            throw new common_1.BadRequestException(error.detail);
        }
        if (error.code == 23502) {
            throw new common_1.BadRequestException('null value in column (' + error.column + ') ' + error.detail);
        }
        this.logger.error(error);
        throw new common_1.InternalServerErrorException('Error inesperado, revisar log');
    }
};
exports.EstadosService = EstadosService;
exports.EstadosService = EstadosService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(estado_entity_1.Estado)),
    __metadata("design:paramtypes", [typeof (_a = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _a : Object])
], EstadosService);


/***/ }),
/* 66 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EstadosController = void 0;
const common_1 = __webpack_require__(6);
const estados_service_1 = __webpack_require__(65);
const create_estado_dto_1 = __webpack_require__(67);
const update_estado_dto_1 = __webpack_require__(68);
const swagger_1 = __webpack_require__(13);
const passport_1 = __webpack_require__(27);
let EstadosController = class EstadosController {
    constructor(estadosService) {
        this.estadosService = estadosService;
    }
    create(createEstadoDto) {
        return this.estadosService.create(createEstadoDto);
    }
    findAll() {
        return this.estadosService.findAll();
    }
    async getEstadoByAreaId(idArea) {
        return this.estadosService.getEstadosByArea(idArea);
    }
    async getEstadosByEmpresaId(idEmpresa) {
        return this.estadosService.getEstadosByEmpresa(idEmpresa);
    }
    async getEstadosByEmpresaArea(idEmpresa, idArea) {
        return this.estadosService.getEstadosByAreaAndEmpresa(idArea, idEmpresa);
    }
    findOne(id) {
        return this.estadosService.findOne(+id);
    }
    update(id, updateEstadoDto) {
        return this.estadosService.update(+id, updateEstadoDto);
    }
    remove(id) {
        return this.estadosService.remove(+id);
    }
};
exports.EstadosController = EstadosController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof create_estado_dto_1.CreateEstadoDto !== "undefined" && create_estado_dto_1.CreateEstadoDto) === "function" ? _b : Object]),
    __metadata("design:returntype", void 0)
], EstadosController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], EstadosController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('area/:idArea'),
    __param(0, (0, common_1.Param)('idArea')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EstadosController.prototype, "getEstadoByAreaId", null);
__decorate([
    (0, common_1.Get)("empresa/:idEmpresa"),
    __param(0, (0, common_1.Param)('idEmpresa')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EstadosController.prototype, "getEstadosByEmpresaId", null);
__decorate([
    (0, common_1.Get)("/empresa/:idEmpresa/area/:idArea"),
    __param(0, (0, common_1.Param)('idEmpresa')),
    __param(1, (0, common_1.Param)('idArea')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], EstadosController.prototype, "getEstadosByEmpresaArea", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], EstadosController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_c = typeof update_estado_dto_1.UpdateEstadoDto !== "undefined" && update_estado_dto_1.UpdateEstadoDto) === "function" ? _c : Object]),
    __metadata("design:returntype", void 0)
], EstadosController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], EstadosController.prototype, "remove", null);
exports.EstadosController = EstadosController = __decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)()),
    (0, swagger_1.ApiTags)("Estado"),
    (0, common_1.Controller)('estados'),
    __metadata("design:paramtypes", [typeof (_a = typeof estados_service_1.EstadosService !== "undefined" && estados_service_1.EstadosService) === "function" ? _a : Object])
], EstadosController);


/***/ }),
/* 67 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreateEstadoDto = void 0;
const swagger_1 = __webpack_require__(13);
const class_validator_1 = __webpack_require__(25);
class CreateEstadoDto {
}
exports.CreateEstadoDto = CreateEstadoDto;
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateEstadoDto.prototype, "nombre", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateEstadoDto.prototype, "descripcion", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreateEstadoDto.prototype, "estado", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateEstadoDto.prototype, "codigo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateEstadoDto.prototype, "orden", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateEstadoDto.prototype, "areaId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateEstadoDto.prototype, "empresaId", void 0);


/***/ }),
/* 68 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UpdateEstadoDto = void 0;
const swagger_1 = __webpack_require__(13);
const create_estado_dto_1 = __webpack_require__(67);
class UpdateEstadoDto extends (0, swagger_1.PartialType)(create_estado_dto_1.CreateEstadoDto) {
}
exports.UpdateEstadoDto = UpdateEstadoDto;


/***/ }),
/* 69 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TicketModule = void 0;
const common_1 = __webpack_require__(6);
const ticket_service_1 = __webpack_require__(70);
const ticket_controller_1 = __webpack_require__(71);
const typeorm_1 = __webpack_require__(7);
const auth_module_1 = __webpack_require__(28);
const ticket_entity_1 = __webpack_require__(21);
const centro_entity_1 = __webpack_require__(14);
const area_entity_1 = __webpack_require__(18);
const usuario_entity_1 = __webpack_require__(17);
const categoria_entity_1 = __webpack_require__(19);
const subcategoria_entity_1 = __webpack_require__(20);
let TicketModule = class TicketModule {
};
exports.TicketModule = TicketModule;
exports.TicketModule = TicketModule = __decorate([
    (0, common_1.Module)({
        controllers: [ticket_controller_1.TicketController],
        providers: [ticket_service_1.TicketService],
        imports: [
            typeorm_1.TypeOrmModule.forFeature([ticket_entity_1.Ticket, centro_entity_1.Centro, area_entity_1.Area, usuario_entity_1.Usuario, categoria_entity_1.Categoria, subcategoria_entity_1.Subcategoria]), auth_module_1.AuthModule
        ]
    })
], TicketModule);


/***/ }),
/* 70 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TicketService = void 0;
const common_1 = __webpack_require__(6);
const typeorm_1 = __webpack_require__(7);
const ticket_entity_1 = __webpack_require__(21);
const typeorm_2 = __webpack_require__(11);
let TicketService = class TicketService {
    constructor(TicketRepository) {
        this.TicketRepository = TicketRepository;
        this.logger = new common_1.Logger('TicketService');
    }
    async create(createTicketDto) {
        try {
            const ticket = this.TicketRepository.create(createTicketDto);
            await this.TicketRepository.save(ticket);
            return ticket;
        }
        catch (error) {
            this.handleDbExceptions(error);
        }
    }
    handleDbExceptions(error) {
        if (error.code == 23503) {
            throw new common_1.BadRequestException(error.detail);
        }
        if (error.code == 23502) {
            throw new common_1.BadRequestException('null value in column (' + error.column + ') ' + error.detail);
        }
        this.logger.error(error);
        throw new common_1.InternalServerErrorException('Error inesperado, revisar log');
    }
    findAll() {
        return this.TicketRepository.find({
            relations: ['area', 'centro', 'usuario', 'estado']
        });
    }
    async findOne(id) {
        const ticket = await this.TicketRepository.findOneBy({ id });
        if (!ticket) {
            throw new common_1.NotFoundException('El Ticket con id: ' + id + " no fue encontrado.");
        }
        return ticket;
    }
    async getTicketsByArea(areaId) {
        return this.TicketRepository.find({
            where: { area: { id: areaId } },
            relations: ['area', 'centro', 'usuario', 'estado', 'categoria', 'usuariosGestion']
        });
    }
    async getTicketsByCategoria(categoriaId) {
        return this.TicketRepository.find({
            where: { categoria: { id: categoriaId } }
        });
    }
    async getTicketsCountByArea(areaId) {
        return this.TicketRepository.createQueryBuilder('ticket')
            .select('ticket.categoriaId', 'categoriaId')
            .addSelect('categoria.nombre', 'categoriaNombre')
            .addSelect('COUNT(ticket.id)', 'count')
            .innerJoin('ticket.categoria', 'categoria')
            .where('ticket.areaId = :areaId', { areaId })
            .groupBy('ticket.categoriaId')
            .addGroupBy('categoria.nombre')
            .getRawMany();
    }
    async getTicketsByUsuario(usuarioId) {
        return this.TicketRepository.find({
            where: { usuario: { id: usuarioId } },
            relations: ['area', 'centro', 'usuario', 'estado', 'categoria']
        });
    }
    async getTicketsByAreaUsuario(areaId, usuarioId) {
        return this.TicketRepository.find({
            where: [{
                    area: { id: areaId },
                    usuario: { id: usuarioId },
                }]
        });
    }
    async update(id, updateTicketDto) {
        const ticket = await this.TicketRepository.preload({ id: id, ...updateTicketDto, });
        if (!ticket) {
            throw new common_1.NotFoundException('Ticket con el id: ' + id + ' no encontrado');
        }
        try {
            await this.TicketRepository.save(ticket);
            return ticket;
        }
        catch (error) {
            this.handleDbExceptions(error);
        }
    }
    remove(id) {
        return `This action removes a #${id} ticket`;
    }
};
exports.TicketService = TicketService;
exports.TicketService = TicketService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(ticket_entity_1.Ticket)),
    __metadata("design:paramtypes", [typeof (_a = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _a : Object])
], TicketService);


/***/ }),
/* 71 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TicketController = void 0;
const common_1 = __webpack_require__(6);
const ticket_service_1 = __webpack_require__(70);
const create_ticket_dto_1 = __webpack_require__(72);
const update_ticket_dto_1 = __webpack_require__(73);
const swagger_1 = __webpack_require__(13);
const passport_1 = __webpack_require__(27);
let TicketController = class TicketController {
    constructor(ticketService) {
        this.ticketService = ticketService;
    }
    create(createTicketDto) {
        return this.ticketService.create(createTicketDto);
    }
    findAll() {
        return this.ticketService.findAll();
    }
    findOne(id) {
        return this.ticketService.findOne(+id);
    }
    async getTicketsByAreaId(idArea) {
        return this.ticketService.getTicketsByArea(idArea);
    }
    async getTicketsByCategoria(idCategoria) {
        return this.ticketService.getTicketsByCategoria(idCategoria);
    }
    async getticketsByUsuarioId(idUsuario) {
        return this.ticketService.getTicketsByUsuario(idUsuario);
    }
    async getTicketsByAreaUsuario(idArea, idUsuario) {
        return this.ticketService.getTicketsByAreaUsuario(idArea, idUsuario);
    }
    async getTicketsCountByCategoria(idArea) {
        return this.ticketService.getTicketsCountByArea(idArea);
    }
    update(id, updateTicketDto) {
        return this.ticketService.update(+id, updateTicketDto);
    }
    remove(id) {
        return this.ticketService.remove(+id);
    }
};
exports.TicketController = TicketController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof create_ticket_dto_1.CreateTicketDto !== "undefined" && create_ticket_dto_1.CreateTicketDto) === "function" ? _b : Object]),
    __metadata("design:returntype", void 0)
], TicketController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TicketController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TicketController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)('area/:idArea'),
    __param(0, (0, common_1.Param)('idArea')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TicketController.prototype, "getTicketsByAreaId", null);
__decorate([
    (0, common_1.Get)('categoria/:idCategoria'),
    __param(0, (0, common_1.Param)('idCategoria')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], TicketController.prototype, "getTicketsByCategoria", null);
__decorate([
    (0, common_1.Get)('usuario/:idUsuario'),
    __param(0, (0, common_1.Param)('idUsuario')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TicketController.prototype, "getticketsByUsuarioId", null);
__decorate([
    (0, common_1.Get)('/area/:idArea/usuario/:idUsuario'),
    __param(0, (0, common_1.Param)('idArea')),
    __param(1, (0, common_1.Param)('idUsuario')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], TicketController.prototype, "getTicketsByAreaUsuario", null);
__decorate([
    (0, common_1.Get)('/area/categorias/dashboard/:idArea'),
    __param(0, (0, common_1.Param)('idArea')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TicketController.prototype, "getTicketsCountByCategoria", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_c = typeof update_ticket_dto_1.UpdateTicketDto !== "undefined" && update_ticket_dto_1.UpdateTicketDto) === "function" ? _c : Object]),
    __metadata("design:returntype", void 0)
], TicketController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TicketController.prototype, "remove", null);
exports.TicketController = TicketController = __decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)()),
    (0, swagger_1.ApiTags)('Ticket'),
    (0, common_1.Controller)('ticket'),
    __metadata("design:paramtypes", [typeof (_a = typeof ticket_service_1.TicketService !== "undefined" && ticket_service_1.TicketService) === "function" ? _a : Object])
], TicketController);


/***/ }),
/* 72 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreateTicketDto = void 0;
const swagger_1 = __webpack_require__(13);
const class_validator_1 = __webpack_require__(25);
class CreateTicketDto {
}
exports.CreateTicketDto = CreateTicketDto;
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateTicketDto.prototype, "titulo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateTicketDto.prototype, "codigo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateTicketDto.prototype, "descripcion", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateTicketDto.prototype, "gestionador", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateTicketDto.prototype, "areaId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateTicketDto.prototype, "estadoId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateTicketDto.prototype, "usuarioId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateTicketDto.prototype, "centroId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateTicketDto.prototype, "categoriaId", void 0);


/***/ }),
/* 73 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UpdateTicketDto = void 0;
const swagger_1 = __webpack_require__(13);
const create_ticket_dto_1 = __webpack_require__(72);
class UpdateTicketDto extends (0, swagger_1.PartialType)(create_ticket_dto_1.CreateTicketDto) {
}
exports.UpdateTicketDto = UpdateTicketDto;


/***/ }),
/* 74 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CategoriaModule = void 0;
const common_1 = __webpack_require__(6);
const categoria_service_1 = __webpack_require__(75);
const categoria_controller_1 = __webpack_require__(76);
const typeorm_1 = __webpack_require__(7);
const area_entity_1 = __webpack_require__(18);
const categoria_entity_1 = __webpack_require__(19);
const ticket_entity_1 = __webpack_require__(21);
const auth_module_1 = __webpack_require__(28);
const subcategoria_entity_1 = __webpack_require__(20);
let CategoriaModule = class CategoriaModule {
};
exports.CategoriaModule = CategoriaModule;
exports.CategoriaModule = CategoriaModule = __decorate([
    (0, common_1.Module)({
        controllers: [categoria_controller_1.CategoriaController],
        providers: [categoria_service_1.CategoriaService],
        imports: [typeorm_1.TypeOrmModule.forFeature([area_entity_1.Area, categoria_entity_1.Categoria, ticket_entity_1.Ticket, subcategoria_entity_1.Subcategoria]), auth_module_1.AuthModule]
    })
], CategoriaModule);


/***/ }),
/* 75 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CategoriaService = void 0;
const common_1 = __webpack_require__(6);
const typeorm_1 = __webpack_require__(7);
const categoria_entity_1 = __webpack_require__(19);
const typeorm_2 = __webpack_require__(11);
let CategoriaService = class CategoriaService {
    constructor(CategoriaRepository) {
        this.CategoriaRepository = CategoriaRepository;
        this.logger = new common_1.Logger('CategoriaService');
    }
    async create(createCategoriaDto) {
        try {
            const categoria = this.CategoriaRepository.create(createCategoriaDto);
            await this.CategoriaRepository.save(categoria);
            return categoria;
        }
        catch (error) {
            this.handleDbExceptions(error);
        }
    }
    findAll() {
        return this.CategoriaRepository.find({
            where: { eliminacion: null },
            relations: ['area']
        });
    }
    async findOne(id) {
        const categoria = await this.CategoriaRepository.findOneBy({ id });
        if (!categoria) {
            throw new common_1.NotFoundException('Categoria con id: ' + id + ' no encontrada.');
        }
        return categoria;
    }
    async getCategoriaByAreaId(areaId) {
        return this.CategoriaRepository.find({
            where: { area: { id: areaId } },
        });
    }
    async update(id, updateCategoriaDto) {
        const categoria = await this.CategoriaRepository.preload({ id: id, ...updateCategoriaDto, });
        if (!categoria) {
            throw new common_1.NotFoundException('Categoria con id: ' + id + ' no encontrada.');
        }
        try {
            await this.CategoriaRepository.save(categoria);
            return categoria;
        }
        catch (error) {
            this.handleDbExceptions(error);
        }
    }
    async remove(id) {
        const categoria = await this.CategoriaRepository.findOneBy({ id });
        if (!categoria) {
            throw new common_1.NotFoundException('Categoria con id: ' + id + ' no encontrada.');
        }
        categoria.eliminacion = new Date();
        try {
            await this.CategoriaRepository.save(categoria);
        }
        catch (error) {
            this.handleDbExceptions(error);
        }
    }
    handleDbExceptions(error) {
        if (error.code == 23503) {
            throw new common_1.BadRequestException(error.detail);
        }
        if (error.code == 23502) {
            throw new common_1.BadRequestException('null value in column (' + error.column + ') ' + error.detail);
        }
        this.logger.error(error);
        throw new common_1.InternalServerErrorException('Error inesperado, revisar log');
    }
};
exports.CategoriaService = CategoriaService;
exports.CategoriaService = CategoriaService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(categoria_entity_1.Categoria)),
    __metadata("design:paramtypes", [typeof (_a = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _a : Object])
], CategoriaService);


/***/ }),
/* 76 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CategoriaController = void 0;
const common_1 = __webpack_require__(6);
const categoria_service_1 = __webpack_require__(75);
const create_categoria_dto_1 = __webpack_require__(77);
const update_categoria_dto_1 = __webpack_require__(78);
const swagger_1 = __webpack_require__(13);
const passport_1 = __webpack_require__(27);
let CategoriaController = class CategoriaController {
    constructor(categoriaService) {
        this.categoriaService = categoriaService;
    }
    create(createCategoriaDto) {
        return this.categoriaService.create(createCategoriaDto);
    }
    findAll() {
        return this.categoriaService.findAll();
    }
    async getCategoriaByAreaId(idArea) {
        return this.categoriaService.getCategoriaByAreaId(idArea);
    }
    findOne(id) {
        return this.categoriaService.findOne(+id);
    }
    update(id, updateCategoriaDto) {
        return this.categoriaService.update(+id, updateCategoriaDto);
    }
    remove(id) {
        return this.categoriaService.remove(+id);
    }
};
exports.CategoriaController = CategoriaController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof create_categoria_dto_1.CreateCategoriaDto !== "undefined" && create_categoria_dto_1.CreateCategoriaDto) === "function" ? _b : Object]),
    __metadata("design:returntype", void 0)
], CategoriaController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CategoriaController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('area/:idArea'),
    __param(0, (0, common_1.Param)('idArea')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CategoriaController.prototype, "getCategoriaByAreaId", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CategoriaController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_c = typeof update_categoria_dto_1.UpdateCategoriaDto !== "undefined" && update_categoria_dto_1.UpdateCategoriaDto) === "function" ? _c : Object]),
    __metadata("design:returntype", void 0)
], CategoriaController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CategoriaController.prototype, "remove", null);
exports.CategoriaController = CategoriaController = __decorate([
    (0, swagger_1.ApiTags)('Categoria'),
    (0, common_1.Controller)('categoria'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)()),
    __metadata("design:paramtypes", [typeof (_a = typeof categoria_service_1.CategoriaService !== "undefined" && categoria_service_1.CategoriaService) === "function" ? _a : Object])
], CategoriaController);


/***/ }),
/* 77 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreateCategoriaDto = void 0;
const swagger_1 = __webpack_require__(13);
const class_validator_1 = __webpack_require__(25);
class CreateCategoriaDto {
}
exports.CreateCategoriaDto = CreateCategoriaDto;
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateCategoriaDto.prototype, "nombre", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateCategoriaDto.prototype, "descripcion", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateCategoriaDto.prototype, "icon", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreateCategoriaDto.prototype, "estado", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateCategoriaDto.prototype, "areaId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateCategoriaDto.prototype, "ticketId", void 0);


/***/ }),
/* 78 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UpdateCategoriaDto = void 0;
const swagger_1 = __webpack_require__(13);
const create_categoria_dto_1 = __webpack_require__(77);
class UpdateCategoriaDto extends (0, swagger_1.PartialType)(create_categoria_dto_1.CreateCategoriaDto) {
}
exports.UpdateCategoriaDto = UpdateCategoriaDto;


/***/ }),
/* 79 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.HistorialTicketModule = void 0;
const common_1 = __webpack_require__(6);
const historial_ticket_service_1 = __webpack_require__(80);
const historial_ticket_controller_1 = __webpack_require__(82);
const typeorm_1 = __webpack_require__(7);
const historial_ticket_entity_1 = __webpack_require__(81);
const auth_module_1 = __webpack_require__(28);
let HistorialTicketModule = class HistorialTicketModule {
};
exports.HistorialTicketModule = HistorialTicketModule;
exports.HistorialTicketModule = HistorialTicketModule = __decorate([
    (0, common_1.Module)({
        controllers: [historial_ticket_controller_1.HistorialTicketController],
        providers: [historial_ticket_service_1.HistorialTicketService],
        imports: [typeorm_1.TypeOrmModule.forFeature([historial_ticket_entity_1.HistorialTicket]), auth_module_1.AuthModule]
    })
], HistorialTicketModule);


/***/ }),
/* 80 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.HistorialTicketService = void 0;
const common_1 = __webpack_require__(6);
const typeorm_1 = __webpack_require__(7);
const historial_ticket_entity_1 = __webpack_require__(81);
const typeorm_2 = __webpack_require__(11);
let HistorialTicketService = class HistorialTicketService {
    constructor(HistorialTicketRepository) {
        this.HistorialTicketRepository = HistorialTicketRepository;
        this.logger = new common_1.Logger('HistorialTicketService');
    }
    async create(createHistorialTicketDto) {
        try {
            const historial = this.HistorialTicketRepository.create(createHistorialTicketDto);
            await this.HistorialTicketRepository.save(historial);
            return historial;
        }
        catch (error) {
            this.handleDbExceptions(error);
        }
    }
    findAll() {
        return this.HistorialTicketRepository.find();
    }
    async findOne(id) {
        const historial = await this.HistorialTicketRepository.findOneBy({ id });
        if (!historial) {
            throw new common_1.NotFoundException("este historial no se encuentra disponible");
        }
        return historial;
    }
    async getOneByTicket(idTicket) {
        return this.HistorialTicketRepository.find({
            where: { idTicket },
            order: { id: 'DESC' },
        });
    }
    handleDbExceptions(error) {
        if (error.code == 23503) {
            throw new common_1.BadRequestException(error.detail);
        }
        if (error.code == 23502) {
            throw new common_1.BadRequestException('null value in column (' + error.column + ') ' + error.detail);
        }
        this.logger.error(error);
        throw new common_1.InternalServerErrorException('Error inesperado, revisar log');
    }
};
exports.HistorialTicketService = HistorialTicketService;
exports.HistorialTicketService = HistorialTicketService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(historial_ticket_entity_1.HistorialTicket)),
    __metadata("design:paramtypes", [typeof (_a = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _a : Object])
], HistorialTicketService);


/***/ }),
/* 81 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.HistorialTicket = void 0;
const swagger_1 = __webpack_require__(13);
const typeorm_1 = __webpack_require__(11);
let HistorialTicket = class HistorialTicket {
};
exports.HistorialTicket = HistorialTicket;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], HistorialTicket.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", typeof (_a = typeof Date !== "undefined" && Date) === "function" ? _a : Object)
], HistorialTicket.prototype, "fecha", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], HistorialTicket.prototype, "mensaje", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)({ type: "numeric", nullable: false }),
    __metadata("design:type", Number)
], HistorialTicket.prototype, "idTicket", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)({ type: 'text', nullable: false }),
    __metadata("design:type", String)
], HistorialTicket.prototype, "analista", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)({ type: 'numeric', nullable: true }),
    __metadata("design:type", Number)
], HistorialTicket.prototype, "idEstado", void 0);
exports.HistorialTicket = HistorialTicket = __decorate([
    (0, typeorm_1.Entity)()
], HistorialTicket);


/***/ }),
/* 82 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.HistorialTicketController = void 0;
const common_1 = __webpack_require__(6);
const historial_ticket_service_1 = __webpack_require__(80);
const create_historial_ticket_dto_1 = __webpack_require__(83);
const swagger_1 = __webpack_require__(13);
const passport_1 = __webpack_require__(27);
let HistorialTicketController = class HistorialTicketController {
    constructor(historialTicketService) {
        this.historialTicketService = historialTicketService;
    }
    create(createHistorialTicketDto) {
        return this.historialTicketService.create(createHistorialTicketDto);
    }
    findAll() {
        return this.historialTicketService.findAll();
    }
    findOne(id) {
        return this.historialTicketService.findOne(+id);
    }
    findOneByTicket(idTicket) {
        return this.historialTicketService.getOneByTicket(idTicket);
    }
};
exports.HistorialTicketController = HistorialTicketController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof create_historial_ticket_dto_1.CreateHistorialTicketDto !== "undefined" && create_historial_ticket_dto_1.CreateHistorialTicketDto) === "function" ? _b : Object]),
    __metadata("design:returntype", void 0)
], HistorialTicketController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], HistorialTicketController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], HistorialTicketController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)('ticket/:idTicket'),
    __param(0, (0, common_1.Param)('idTicket')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], HistorialTicketController.prototype, "findOneByTicket", null);
exports.HistorialTicketController = HistorialTicketController = __decorate([
    (0, swagger_1.ApiTags)('HistorialTicket'),
    (0, common_1.Controller)('historial-ticket'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)()),
    __metadata("design:paramtypes", [typeof (_a = typeof historial_ticket_service_1.HistorialTicketService !== "undefined" && historial_ticket_service_1.HistorialTicketService) === "function" ? _a : Object])
], HistorialTicketController);


/***/ }),
/* 83 */
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreateHistorialTicketDto = void 0;
class CreateHistorialTicketDto {
}
exports.CreateHistorialTicketDto = CreateHistorialTicketDto;


/***/ }),
/* 84 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SubcategoriaModule = void 0;
const common_1 = __webpack_require__(6);
const subcategoria_service_1 = __webpack_require__(85);
const subcategoria_controller_1 = __webpack_require__(86);
const typeorm_1 = __webpack_require__(7);
const categoria_entity_1 = __webpack_require__(19);
const ticket_entity_1 = __webpack_require__(21);
const auth_module_1 = __webpack_require__(28);
const subcategoria_entity_1 = __webpack_require__(20);
let SubcategoriaModule = class SubcategoriaModule {
};
exports.SubcategoriaModule = SubcategoriaModule;
exports.SubcategoriaModule = SubcategoriaModule = __decorate([
    (0, common_1.Module)({
        controllers: [subcategoria_controller_1.SubcategoriaController],
        providers: [subcategoria_service_1.SubcategoriaService],
        imports: [typeorm_1.TypeOrmModule.forFeature([categoria_entity_1.Categoria, ticket_entity_1.Ticket, subcategoria_entity_1.Subcategoria]), auth_module_1.AuthModule]
    })
], SubcategoriaModule);


/***/ }),
/* 85 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SubcategoriaService = void 0;
const common_1 = __webpack_require__(6);
const typeorm_1 = __webpack_require__(7);
const typeorm_2 = __webpack_require__(11);
const subcategoria_entity_1 = __webpack_require__(20);
let SubcategoriaService = class SubcategoriaService {
    constructor(SubcategoriaRepository) {
        this.SubcategoriaRepository = SubcategoriaRepository;
        this.logger = new common_1.Logger('SubcategoriaService');
    }
    async create(createSubcategoriaDto) {
        try {
            const subcategoria = this.SubcategoriaRepository.create(createSubcategoriaDto);
            await this.SubcategoriaRepository.save(subcategoria);
            return subcategoria;
        }
        catch (error) {
            this.handleDbExceptions(error);
        }
    }
    findAll() {
        return this.SubcategoriaRepository.find({
            relations: ['categoria']
        });
    }
    async findOne(id) {
        const sub = await this.SubcategoriaRepository.findOneBy({ id });
        if (!sub) {
            throw new common_1.NotFoundException('Subcategoria con id: ' + id + ' no encontrada');
        }
        return sub;
    }
    async getSubcategoriaByCategoriaId(categoriaId) {
        return this.SubcategoriaRepository.find({
            where: { categoria: { id: Number(categoriaId) } },
        });
    }
    async update(id, updateSubcategoriaDto) {
        const sub = await this.SubcategoriaRepository.preload({ id: id, ...updateSubcategoriaDto, });
        if (!sub) {
            throw new common_1.NotFoundException('Subcategoria con id: ' + id + ' no encontrada.');
        }
        try {
            await this.SubcategoriaRepository.save(sub);
            return sub;
        }
        catch (error) {
            this.handleDbExceptions(error);
        }
    }
    async remove(id) {
        const sub = await this.SubcategoriaRepository.findOneBy({ id });
        if (!sub) {
            throw new common_1.NotFoundException('Subcategoria con id: ' + id + ' no encontrada.');
        }
        sub.eliminacion = new Date();
        try {
            await this.SubcategoriaRepository.save(sub);
        }
        catch (error) {
            this.handleDbExceptions(error);
        }
    }
    handleDbExceptions(error) {
        if (error.code == 23503) {
            throw new common_1.BadRequestException(error.detail);
        }
        if (error.code == 23502) {
            throw new common_1.BadRequestException('null value in column (' + error.column + ') ' + error.detail);
        }
        this.logger.error(error);
        throw new common_1.InternalServerErrorException('Error inesperado, revisar log');
    }
};
exports.SubcategoriaService = SubcategoriaService;
exports.SubcategoriaService = SubcategoriaService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(subcategoria_entity_1.Subcategoria)),
    __metadata("design:paramtypes", [typeof (_a = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _a : Object])
], SubcategoriaService);


/***/ }),
/* 86 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SubcategoriaController = void 0;
const common_1 = __webpack_require__(6);
const subcategoria_service_1 = __webpack_require__(85);
const create_subcategoria_dto_1 = __webpack_require__(87);
const update_subcategoria_dto_1 = __webpack_require__(88);
const swagger_1 = __webpack_require__(13);
const passport_1 = __webpack_require__(27);
let SubcategoriaController = class SubcategoriaController {
    constructor(subcategoriaService) {
        this.subcategoriaService = subcategoriaService;
    }
    create(createSubcategoriaDto) {
        return this.subcategoriaService.create(createSubcategoriaDto);
    }
    findAll() {
        return this.subcategoriaService.findAll();
    }
    findOne(id) {
        return this.subcategoriaService.findOne(+id);
    }
    async getCategoriaByAreaId(idCategoria) {
        return this.subcategoriaService.getSubcategoriaByCategoriaId(idCategoria);
    }
    update(id, updateSubcategoriaDto) {
        return this.subcategoriaService.update(+id, updateSubcategoriaDto);
    }
    remove(id) {
        return this.subcategoriaService.remove(+id);
    }
};
exports.SubcategoriaController = SubcategoriaController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof create_subcategoria_dto_1.CreateSubcategoriaDto !== "undefined" && create_subcategoria_dto_1.CreateSubcategoriaDto) === "function" ? _b : Object]),
    __metadata("design:returntype", void 0)
], SubcategoriaController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SubcategoriaController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SubcategoriaController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)('categoria/:idCategoria'),
    __param(0, (0, common_1.Param)('idCategoria')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SubcategoriaController.prototype, "getCategoriaByAreaId", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_c = typeof update_subcategoria_dto_1.UpdateSubcategoriaDto !== "undefined" && update_subcategoria_dto_1.UpdateSubcategoriaDto) === "function" ? _c : Object]),
    __metadata("design:returntype", void 0)
], SubcategoriaController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SubcategoriaController.prototype, "remove", null);
exports.SubcategoriaController = SubcategoriaController = __decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)()),
    (0, swagger_1.ApiTags)('Subcategoria'),
    (0, common_1.Controller)('subcategoria'),
    __metadata("design:paramtypes", [typeof (_a = typeof subcategoria_service_1.SubcategoriaService !== "undefined" && subcategoria_service_1.SubcategoriaService) === "function" ? _a : Object])
], SubcategoriaController);


/***/ }),
/* 87 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreateSubcategoriaDto = void 0;
const swagger_1 = __webpack_require__(13);
const class_validator_1 = __webpack_require__(25);
class CreateSubcategoriaDto {
}
exports.CreateSubcategoriaDto = CreateSubcategoriaDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Nombre de la subcategoría', nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateSubcategoriaDto.prototype, "nombre", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Descripción de la subcategoría', nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateSubcategoriaDto.prototype, "descripcion", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ID de la categoría asociada', nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateSubcategoriaDto.prototype, "categoriaId", void 0);


/***/ }),
/* 88 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UpdateSubcategoriaDto = void 0;
const swagger_1 = __webpack_require__(13);
const create_subcategoria_dto_1 = __webpack_require__(87);
class UpdateSubcategoriaDto extends (0, swagger_1.PartialType)(create_subcategoria_dto_1.CreateSubcategoriaDto) {
}
exports.UpdateSubcategoriaDto = UpdateSubcategoriaDto;


/***/ }),
/* 89 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PerfilModule = void 0;
const common_1 = __webpack_require__(6);
const perfil_service_1 = __webpack_require__(90);
const perfil_controller_1 = __webpack_require__(95);
const typeorm_1 = __webpack_require__(7);
const usuario_entity_1 = __webpack_require__(17);
const cuenta_entity_1 = __webpack_require__(16);
const cuenta_empresa_entity_1 = __webpack_require__(12);
const ticket_entity_1 = __webpack_require__(21);
const area_entity_1 = __webpack_require__(18);
const auth_module_1 = __webpack_require__(28);
const perfil_entity_1 = __webpack_require__(91);
let PerfilModule = class PerfilModule {
};
exports.PerfilModule = PerfilModule;
exports.PerfilModule = PerfilModule = __decorate([
    (0, common_1.Module)({
        controllers: [perfil_controller_1.PerfilController],
        providers: [perfil_service_1.PerfilService],
        exports: [typeorm_1.TypeOrmModule],
        imports: [typeorm_1.TypeOrmModule.forFeature([usuario_entity_1.Usuario, cuenta_entity_1.Cuenta, cuenta_empresa_entity_1.CuentaEmpresa, ticket_entity_1.Ticket, area_entity_1.Area, perfil_entity_1.Perfil]), auth_module_1.AuthModule],
    })
], PerfilModule);


/***/ }),
/* 90 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PerfilService = void 0;
const common_1 = __webpack_require__(6);
const typeorm_1 = __webpack_require__(7);
const perfil_entity_1 = __webpack_require__(91);
const typeorm_2 = __webpack_require__(11);
let PerfilService = class PerfilService {
    constructor(perfilRepository) {
        this.perfilRepository = perfilRepository;
        this.logger = new common_1.Logger('PerfilService');
    }
    async create(createPerfilDto) {
        try {
            const Perfil = this.perfilRepository.create(createPerfilDto);
            await this.perfilRepository.save(Perfil);
            return Perfil;
        }
        catch (error) {
            this.handleDbExceptions(error);
        }
    }
    async findAll() {
        return this.perfilRepository.createQueryBuilder('perfil').
            where('perfil.estado IS NULL').getMany();
    }
    async findOne(id) {
        const perfil = await this.perfilRepository.findOneBy({ id });
        if (!perfil) {
            throw new common_1.NotFoundException('Perfil con id: ' + id + ' no encontrado');
        }
    }
    async update(id, updatePerfilDto) {
        const perfil = await this.perfilRepository.preload({ id: id, ...updatePerfilDto, });
        if (!perfil) {
            throw new common_1.NotFoundException("Perfil no encontrado");
        }
        try {
            await this.perfilRepository.save(perfil);
            return perfil;
        }
        catch (error) {
            this.handleDbExceptions(error);
        }
    }
    async remove(id) {
        const perfil = await this.perfilRepository.findOneBy({ id });
        if (!perfil) {
            throw new common_1.NotFoundException("Perfil con ese ID no encontrado");
        }
        perfil.estado = false;
        try {
            await this.perfilRepository.save(perfil);
        }
        catch (error) {
            this.handleDbExceptions(error);
        }
    }
    handleDbExceptions(error) {
        if (error.code == 23503) {
            throw new common_1.BadRequestException(error.detail);
        }
        if (error.code == 23502) {
            throw new common_1.BadRequestException('null value in column (' + error.column + ') ' + error.detail);
        }
        this.logger.error(error);
        throw new common_1.InternalServerErrorException('Error inesperado, revisar log');
    }
};
exports.PerfilService = PerfilService;
exports.PerfilService = PerfilService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(perfil_entity_1.Perfil)),
    __metadata("design:paramtypes", [typeof (_a = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _a : Object])
], PerfilService);


/***/ }),
/* 91 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Perfil = void 0;
const swagger_1 = __webpack_require__(13);
const permiso_entity_1 = __webpack_require__(92);
const typeorm_1 = __webpack_require__(11);
let Perfil = class Perfil {
};
exports.Perfil = Perfil;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Perfil.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Perfil.prototype, "nombre", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Perfil.prototype, "descripcion", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], Perfil.prototype, "estado", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => permiso_entity_1.Permiso, (pm) => pm.perfil),
    __metadata("design:type", Array)
], Perfil.prototype, "permisos", void 0);
exports.Perfil = Perfil = __decorate([
    (0, typeorm_1.Entity)()
], Perfil);


/***/ }),
/* 92 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Permiso = void 0;
const typeorm_1 = __webpack_require__(11);
const perfil_entity_1 = __webpack_require__(91);
const menu_nivel2_entity_1 = __webpack_require__(93);
const menu_nivel1_entity_1 = __webpack_require__(94);
let Permiso = class Permiso {
};
exports.Permiso = Permiso;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Permiso.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => perfil_entity_1.Perfil, (perfil) => perfil.permisos, { eager: true }),
    (0, typeorm_1.JoinColumn)({ name: 'perfil_id' }),
    __metadata("design:type", typeof (_a = typeof perfil_entity_1.Perfil !== "undefined" && perfil_entity_1.Perfil) === "function" ? _a : Object)
], Permiso.prototype, "perfil", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => menu_nivel1_entity_1.MenuNivel1, { nullable: true, eager: true }),
    (0, typeorm_1.JoinColumn)({ name: 'menuNivel1Id' }),
    __metadata("design:type", typeof (_b = typeof menu_nivel1_entity_1.MenuNivel1 !== "undefined" && menu_nivel1_entity_1.MenuNivel1) === "function" ? _b : Object)
], Permiso.prototype, "menuNivel1", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => menu_nivel2_entity_1.MenuNivel2, { nullable: true, eager: true }),
    (0, typeorm_1.JoinColumn)({ name: 'menuNivel2Id' }),
    __metadata("design:type", typeof (_c = typeof menu_nivel2_entity_1.MenuNivel2 !== "undefined" && menu_nivel2_entity_1.MenuNivel2) === "function" ? _c : Object)
], Permiso.prototype, "menuNivel2", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], Permiso.prototype, "habilitado", void 0);
exports.Permiso = Permiso = __decorate([
    (0, typeorm_1.Entity)()
], Permiso);


/***/ }),
/* 93 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MenuNivel2 = void 0;
const swagger_1 = __webpack_require__(13);
const menu_nivel1_entity_1 = __webpack_require__(94);
const typeorm_1 = __webpack_require__(11);
let MenuNivel2 = class MenuNivel2 {
};
exports.MenuNivel2 = MenuNivel2;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], MenuNivel2.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], MenuNivel2.prototype, "nombre", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], MenuNivel2.prototype, "descripcion", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", Boolean)
], MenuNivel2.prototype, "estado", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], MenuNivel2.prototype, "ruta", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], MenuNivel2.prototype, "icon", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => menu_nivel1_entity_1.MenuNivel1, (menu1) => menu1.menus2),
    (0, typeorm_1.JoinColumn)({ name: 'menunivel1' }),
    __metadata("design:type", typeof (_a = typeof menu_nivel1_entity_1.MenuNivel1 !== "undefined" && menu_nivel1_entity_1.MenuNivel1) === "function" ? _a : Object)
], MenuNivel2.prototype, "menu1", void 0);
exports.MenuNivel2 = MenuNivel2 = __decorate([
    (0, typeorm_1.Entity)()
], MenuNivel2);


/***/ }),
/* 94 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MenuNivel1 = void 0;
const swagger_1 = __webpack_require__(13);
const menu_nivel2_entity_1 = __webpack_require__(93);
const typeorm_1 = __webpack_require__(11);
let MenuNivel1 = class MenuNivel1 {
};
exports.MenuNivel1 = MenuNivel1;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], MenuNivel1.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], MenuNivel1.prototype, "nombre", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], MenuNivel1.prototype, "descripcion", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", Boolean)
], MenuNivel1.prototype, "estado", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], MenuNivel1.prototype, "ruta", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], MenuNivel1.prototype, "icon", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => menu_nivel2_entity_1.MenuNivel2, (menu2) => menu2.menu1),
    __metadata("design:type", Array)
], MenuNivel1.prototype, "menus2", void 0);
exports.MenuNivel1 = MenuNivel1 = __decorate([
    (0, typeorm_1.Entity)()
], MenuNivel1);


/***/ }),
/* 95 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PerfilController = void 0;
const common_1 = __webpack_require__(6);
const perfil_service_1 = __webpack_require__(90);
const create_perfil_dto_1 = __webpack_require__(96);
const update_perfil_dto_1 = __webpack_require__(97);
const swagger_1 = __webpack_require__(13);
const passport_1 = __webpack_require__(27);
let PerfilController = class PerfilController {
    constructor(perfilService) {
        this.perfilService = perfilService;
    }
    create(createPerfilDto) {
        return this.perfilService.create(createPerfilDto);
    }
    findAll() {
        return this.perfilService.findAll();
    }
    findOne(id) {
        return this.perfilService.findOne(+id);
    }
    update(id, updatePerfilDto) {
        return this.perfilService.update(+id, updatePerfilDto);
    }
    remove(id) {
        return this.perfilService.remove(+id);
    }
};
exports.PerfilController = PerfilController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof create_perfil_dto_1.CreatePerfilDto !== "undefined" && create_perfil_dto_1.CreatePerfilDto) === "function" ? _b : Object]),
    __metadata("design:returntype", void 0)
], PerfilController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PerfilController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PerfilController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_c = typeof update_perfil_dto_1.UpdatePerfilDto !== "undefined" && update_perfil_dto_1.UpdatePerfilDto) === "function" ? _c : Object]),
    __metadata("design:returntype", void 0)
], PerfilController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PerfilController.prototype, "remove", null);
exports.PerfilController = PerfilController = __decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)()),
    (0, swagger_1.ApiTags)('Perfil'),
    (0, common_1.Controller)('perfil'),
    __metadata("design:paramtypes", [typeof (_a = typeof perfil_service_1.PerfilService !== "undefined" && perfil_service_1.PerfilService) === "function" ? _a : Object])
], PerfilController);


/***/ }),
/* 96 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreatePerfilDto = void 0;
const class_validator_1 = __webpack_require__(25);
const swagger_1 = __webpack_require__(13);
class CreatePerfilDto {
}
exports.CreatePerfilDto = CreatePerfilDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Nombre del perfil' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePerfilDto.prototype, "nombre", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Descripción del perfil', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePerfilDto.prototype, "descripcion", void 0);


/***/ }),
/* 97 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UpdatePerfilDto = void 0;
const swagger_1 = __webpack_require__(13);
const create_perfil_dto_1 = __webpack_require__(96);
class UpdatePerfilDto extends (0, swagger_1.PartialType)(create_perfil_dto_1.CreatePerfilDto) {
}
exports.UpdatePerfilDto = UpdatePerfilDto;


/***/ }),
/* 98 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MenuNivel1Module = void 0;
const common_1 = __webpack_require__(6);
const menu_nivel1_service_1 = __webpack_require__(99);
const menu_nivel1_controller_1 = __webpack_require__(101);
const typeorm_1 = __webpack_require__(7);
const menu_nivel1_entity_1 = __webpack_require__(94);
const menu_nivel2_entity_1 = __webpack_require__(93);
const auth_module_1 = __webpack_require__(28);
const permiso_entity_1 = __webpack_require__(92);
const permisos_service_1 = __webpack_require__(100);
const perfil_entity_1 = __webpack_require__(91);
let MenuNivel1Module = class MenuNivel1Module {
};
exports.MenuNivel1Module = MenuNivel1Module;
exports.MenuNivel1Module = MenuNivel1Module = __decorate([
    (0, common_1.Module)({
        controllers: [menu_nivel1_controller_1.MenuNivel1Controller],
        providers: [menu_nivel1_service_1.MenuNivel1Service, permisos_service_1.PermisosService],
        imports: [typeorm_1.TypeOrmModule.forFeature([menu_nivel1_entity_1.MenuNivel1, menu_nivel2_entity_1.MenuNivel2, permiso_entity_1.Permiso, perfil_entity_1.Perfil]), auth_module_1.AuthModule],
    })
], MenuNivel1Module);


/***/ }),
/* 99 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MenuNivel1Service = void 0;
const common_1 = __webpack_require__(6);
const typeorm_1 = __webpack_require__(7);
const menu_nivel1_entity_1 = __webpack_require__(94);
const typeorm_2 = __webpack_require__(11);
const permisos_service_1 = __webpack_require__(100);
let MenuNivel1Service = class MenuNivel1Service {
    constructor(MenuNivel1Repository, permisoService) {
        this.MenuNivel1Repository = MenuNivel1Repository;
        this.permisoService = permisoService;
        this.logger = new common_1.Logger('MenuNivel1');
    }
    async create(createMenuNivel1Dto) {
        try {
            const menu = this.MenuNivel1Repository.create(createMenuNivel1Dto);
            const newMenu = await this.MenuNivel1Repository.save(menu);
            await this.permisoService.crearPermisosParaMenu1(newMenu);
            return menu;
        }
        catch (error) {
            this.handleDbExceptions(error);
        }
    }
    findAll() {
        return this.MenuNivel1Repository.find({
            where: { estado: true },
        });
    }
    findOne(id) {
        return `This action returns a #${id} menuNivel1`;
    }
    async findAllWithMenus2() {
        const menusNivel1 = await this.MenuNivel1Repository.find({
            where: { estado: true },
            relations: ['menus2'],
            order: {
                id: 'ASC',
                menus2: {
                    id: 'ASC',
                },
            },
        });
        return menusNivel1.map((menu1) => ({
            ...menu1,
            menus2: menu1.menus2.filter((m) => m.estado === true),
        }));
    }
    async update(id, updateMenuNivel1Dto) {
        const menu = await this.MenuNivel1Repository.preload({
            id: id,
            ...updateMenuNivel1Dto,
        });
        if (!menu) {
            throw new common_1.NotFoundException("Menu Nivel 1 con este id no encontrado");
        }
        try {
            await this.MenuNivel1Repository.save(menu);
            return menu;
        }
        catch (error) {
            this.handleDbExceptions(error);
        }
    }
    async remove(id) {
        const menu = await this.MenuNivel1Repository.findOneBy({ id });
        if (!menu) {
            throw new common_1.NotFoundException("no se encontró el Menu Nivel1 con este ID");
        }
        try {
            menu.estado = false;
            await this.MenuNivel1Repository.save(menu);
        }
        catch (error) {
            this.handleDbExceptions(error);
        }
    }
    handleDbExceptions(error) {
        if (error.code == 23503) {
            throw new common_1.BadRequestException(error.detail);
        }
        if (error.code == 23502) {
            throw new common_1.BadRequestException('null value in column (' + error.column + ') ' + error.detail);
        }
        this.logger.error(error);
        throw new common_1.InternalServerErrorException('Error inesperado, revisar log');
    }
};
exports.MenuNivel1Service = MenuNivel1Service;
exports.MenuNivel1Service = MenuNivel1Service = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(menu_nivel1_entity_1.MenuNivel1)),
    __metadata("design:paramtypes", [typeof (_a = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _a : Object, typeof (_b = typeof permisos_service_1.PermisosService !== "undefined" && permisos_service_1.PermisosService) === "function" ? _b : Object])
], MenuNivel1Service);


/***/ }),
/* 100 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PermisosService = void 0;
const common_1 = __webpack_require__(6);
const typeorm_1 = __webpack_require__(7);
const typeorm_2 = __webpack_require__(11);
const permiso_entity_1 = __webpack_require__(92);
const perfil_entity_1 = __webpack_require__(91);
const menu_nivel1_entity_1 = __webpack_require__(94);
const menu_nivel2_entity_1 = __webpack_require__(93);
let PermisosService = class PermisosService {
    constructor(permisoRepo, perfilRepo, menuNivel1Repo, menuNivel2Repo) {
        this.permisoRepo = permisoRepo;
        this.perfilRepo = perfilRepo;
        this.menuNivel1Repo = menuNivel1Repo;
        this.menuNivel2Repo = menuNivel2Repo;
    }
    async crearPermisosParaMenu1(menu1) {
        const perfiles = await this.perfilRepo.find();
        const permisos = perfiles.map((perfil) => this.permisoRepo.create({
            perfil,
            menuNivel1: menu1,
            habilitado: false,
        }));
        return this.permisoRepo.save(permisos);
    }
    async crearPermisosParaMenu2(menu2) {
        const perfiles = await this.perfilRepo.find();
        const permisos = perfiles.map((perfil) => this.permisoRepo.create({
            perfil,
            menuNivel2: menu2,
            menuNivel1: menu2.menu1,
            habilitado: false,
        }));
        return this.permisoRepo.save(permisos);
    }
    async update(id, dto) {
        const permiso = await this.permisoRepo.findOneBy({ id });
        if (!permiso)
            throw new common_1.NotFoundException('Permiso no encontrado');
        permiso.habilitado = dto.habilitado;
        return this.permisoRepo.save(permiso);
    }
    async getPermisosPorPerfil(perfilId) {
        const permisos = await this.permisoRepo.find({
            where: { perfil: { id: perfilId } },
            relations: ['menuNivel1', 'menuNivel2'],
        });
        const menuMap = new Map();
        permisos.forEach(p => {
            if (!p.menuNivel1)
                return;
            if (!menuMap.has(p.menuNivel1.id)) {
                const permisoNivel1 = permisos.find(perm => perm.menuNivel1?.id === p.menuNivel1.id && !perm.menuNivel2);
                menuMap.set(p.menuNivel1.id, {
                    id: p.menuNivel1.id,
                    nombre: p.menuNivel1.nombre,
                    icono: p.menuNivel1.icon,
                    idPermiso: permisoNivel1 ? permisoNivel1.id : null,
                    habilitado: permisoNivel1 ? permisoNivel1.habilitado : false,
                    nivel2: [],
                });
            }
            if (p.menuNivel2) {
                menuMap.get(p.menuNivel1.id).nivel2.push({
                    id: p.menuNivel2.id,
                    nombre: p.menuNivel2.nombre,
                    ruta: p.menuNivel2.ruta,
                    icon: p.menuNivel2.icon,
                    habilitado: p.habilitado,
                    idPermiso: p.id,
                });
            }
        });
        return Array.from(menuMap.values());
    }
    async getPermisosActivosPorPerfil(perfilId) {
        const permisos = await this.permisoRepo.find({
            where: { perfil: { id: perfilId }, habilitado: true },
            relations: ['menuNivel1', 'menuNivel2'],
        });
        const todosNivel1 = await this.menuNivel1Repo.find({
            where: { estado: true },
        });
        const menuMap = new Map();
        todosNivel1.forEach(menu1 => {
            const permisoNivel1 = permisos.find(p => p.menuNivel1?.id === menu1.id && !p.menuNivel2);
            menuMap.set(menu1.id, {
                id: menu1.id,
                nombre: menu1.nombre,
                icono: menu1.icon,
                idPermiso: permisoNivel1 ? permisoNivel1.id : null,
                nivel2: [],
            });
        });
        permisos.forEach(p => {
            if (!p.menuNivel2 || !p.habilitado)
                return;
            if (!p.menuNivel1 || !p.menuNivel1.estado)
                return;
            const menu1Entry = menuMap.get(p.menuNivel1.id);
            if (menu1Entry) {
                menu1Entry.nivel2.push({
                    id: p.menuNivel2.id,
                    nombre: p.menuNivel2.nombre,
                    ruta: p.menuNivel2.ruta,
                    habilitado: p.habilitado,
                    icon: p.menuNivel2.icon,
                    idPermiso: p.id,
                });
            }
        });
        return Array.from(menuMap.values()).filter(menu1 => menu1.nivel2.length > 0 || menu1.idPermiso);
    }
};
exports.PermisosService = PermisosService;
exports.PermisosService = PermisosService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(permiso_entity_1.Permiso)),
    __param(1, (0, typeorm_1.InjectRepository)(perfil_entity_1.Perfil)),
    __param(2, (0, typeorm_1.InjectRepository)(menu_nivel1_entity_1.MenuNivel1)),
    __param(3, (0, typeorm_1.InjectRepository)(menu_nivel2_entity_1.MenuNivel2)),
    __metadata("design:paramtypes", [typeof (_a = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _a : Object, typeof (_b = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _b : Object, typeof (_c = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _c : Object, typeof (_d = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _d : Object])
], PermisosService);


/***/ }),
/* 101 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MenuNivel1Controller = void 0;
const common_1 = __webpack_require__(6);
const menu_nivel1_service_1 = __webpack_require__(99);
const create_menu_nivel1_dto_1 = __webpack_require__(102);
const update_menu_nivel1_dto_1 = __webpack_require__(103);
const swagger_1 = __webpack_require__(13);
const passport_1 = __webpack_require__(27);
let MenuNivel1Controller = class MenuNivel1Controller {
    constructor(menuNivel1Service) {
        this.menuNivel1Service = menuNivel1Service;
    }
    create(createMenuNivel1Dto) {
        return this.menuNivel1Service.create(createMenuNivel1Dto);
    }
    findAll() {
        return this.menuNivel1Service.findAll();
    }
    findOne(id) {
        return this.menuNivel1Service.findOne(+id);
    }
    findAllWithMenus2() {
        return this.menuNivel1Service.findAllWithMenus2();
    }
    update(id, updateMenuNivel1Dto) {
        return this.menuNivel1Service.update(+id, updateMenuNivel1Dto);
    }
    remove(id) {
        return this.menuNivel1Service.remove(+id);
    }
};
exports.MenuNivel1Controller = MenuNivel1Controller;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof create_menu_nivel1_dto_1.CreateMenuNivel1Dto !== "undefined" && create_menu_nivel1_dto_1.CreateMenuNivel1Dto) === "function" ? _b : Object]),
    __metadata("design:returntype", void 0)
], MenuNivel1Controller.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], MenuNivel1Controller.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MenuNivel1Controller.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)('completo'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], MenuNivel1Controller.prototype, "findAllWithMenus2", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_c = typeof update_menu_nivel1_dto_1.UpdateMenuNivel1Dto !== "undefined" && update_menu_nivel1_dto_1.UpdateMenuNivel1Dto) === "function" ? _c : Object]),
    __metadata("design:returntype", void 0)
], MenuNivel1Controller.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MenuNivel1Controller.prototype, "remove", null);
exports.MenuNivel1Controller = MenuNivel1Controller = __decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)()),
    (0, swagger_1.ApiTags)('MenuNivel1'),
    (0, common_1.Controller)('menu-nivel1'),
    __metadata("design:paramtypes", [typeof (_a = typeof menu_nivel1_service_1.MenuNivel1Service !== "undefined" && menu_nivel1_service_1.MenuNivel1Service) === "function" ? _a : Object])
], MenuNivel1Controller);


/***/ }),
/* 102 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreateMenuNivel1Dto = void 0;
const swagger_1 = __webpack_require__(13);
const class_validator_1 = __webpack_require__(25);
class CreateMenuNivel1Dto {
}
exports.CreateMenuNivel1Dto = CreateMenuNivel1Dto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: "Mantenedores" }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateMenuNivel1Dto.prototype, "nombre", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "Sección de mantenedores", required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateMenuNivel1Dto.prototype, "descripcion", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: true, default: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateMenuNivel1Dto.prototype, "estado", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "/mantenedores", required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateMenuNivel1Dto.prototype, "ruta", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "settings", required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateMenuNivel1Dto.prototype, "icon", void 0);


/***/ }),
/* 103 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UpdateMenuNivel1Dto = void 0;
const swagger_1 = __webpack_require__(13);
const create_menu_nivel1_dto_1 = __webpack_require__(102);
class UpdateMenuNivel1Dto extends (0, swagger_1.PartialType)(create_menu_nivel1_dto_1.CreateMenuNivel1Dto) {
}
exports.UpdateMenuNivel1Dto = UpdateMenuNivel1Dto;


/***/ }),
/* 104 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MenuNivel2Module = void 0;
const common_1 = __webpack_require__(6);
const menu_nivel2_service_1 = __webpack_require__(105);
const menu_nivel2_controller_1 = __webpack_require__(108);
const menu_nivel1_entity_1 = __webpack_require__(94);
const menu_nivel2_entity_1 = __webpack_require__(93);
const auth_module_1 = __webpack_require__(28);
const typeorm_1 = __webpack_require__(7);
const permiso_entity_1 = __webpack_require__(92);
const perfil_entity_1 = __webpack_require__(91);
const permisos_service_1 = __webpack_require__(100);
let MenuNivel2Module = class MenuNivel2Module {
};
exports.MenuNivel2Module = MenuNivel2Module;
exports.MenuNivel2Module = MenuNivel2Module = __decorate([
    (0, common_1.Module)({
        controllers: [menu_nivel2_controller_1.MenuNivel2Controller],
        providers: [menu_nivel2_service_1.MenuNivel2Service, permisos_service_1.PermisosService],
        imports: [typeorm_1.TypeOrmModule.forFeature([menu_nivel1_entity_1.MenuNivel1, menu_nivel2_entity_1.MenuNivel2, permiso_entity_1.Permiso, perfil_entity_1.Perfil]), auth_module_1.AuthModule],
    })
], MenuNivel2Module);


/***/ }),
/* 105 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c, _d, _e;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MenuNivel2Service = void 0;
const common_1 = __webpack_require__(6);
const update_menu_nivel2_dto_1 = __webpack_require__(106);
const typeorm_1 = __webpack_require__(7);
const menu_nivel2_entity_1 = __webpack_require__(93);
const typeorm_2 = __webpack_require__(11);
const permiso_entity_1 = __webpack_require__(92);
const perfil_entity_1 = __webpack_require__(91);
const permisos_service_1 = __webpack_require__(100);
const menu_nivel1_entity_1 = __webpack_require__(94);
let MenuNivel2Service = class MenuNivel2Service {
    constructor(MenuNivel2Repository, permisoRepository, perfilRepository, menuNivel1Repository, permisoService) {
        this.MenuNivel2Repository = MenuNivel2Repository;
        this.permisoRepository = permisoRepository;
        this.perfilRepository = perfilRepository;
        this.menuNivel1Repository = menuNivel1Repository;
        this.permisoService = permisoService;
        this.logger = new common_1.Logger('MenuNivel2');
    }
    async create(dto) {
        const menu1 = await this.menuNivel1Repository.findOne({
            where: { id: dto.menu1Id },
        });
        if (!menu1)
            throw new common_1.NotFoundException('MenuNivel1 no encontrado');
        const menu2 = this.MenuNivel2Repository.create({
            nombre: dto.nombre,
            descripcion: dto.descripcion,
            estado: dto.estado ?? true,
            ruta: dto.ruta,
            icon: dto.icon,
            menu1: menu1,
        });
        const nuevoMenu2 = await this.MenuNivel2Repository.save(menu2);
        await this.permisoService.crearPermisosParaMenu2(nuevoMenu2);
        return nuevoMenu2;
    }
    findAll() {
        return this.MenuNivel2Repository.find({
            where: { estado: true },
        });
    }
    findOne(id) {
        return `This action returns a #${id} menuNivel2`;
    }
    async findByMenuNivel1(menuNivel1Id) {
        return this.MenuNivel2Repository.find({
            where: {
                menu1: { id: menuNivel1Id },
                estado: true,
            },
            relations: ['menu1'],
        });
    }
    async update(id, updateMenuNivel2Dto) {
        const menu = await this.MenuNivel2Repository.preload({ id: id, ...update_menu_nivel2_dto_1.UpdateMenuNivel2Dto, });
        if (!menu) {
            throw new common_1.NotFoundException("No se encontró el menu Nivel 2 con este id");
        }
        try {
            await this.MenuNivel2Repository.save(menu);
            return menu;
        }
        catch (error) {
            this.handleDbExceptions(error);
        }
    }
    async remove(id) {
        const menu = await this.MenuNivel2Repository.findOneBy({ id });
        if (!menu) {
            throw new common_1.NotFoundException("no se encontró el Menu Nivel 2 con este id");
        }
        try {
            menu.estado = false;
            await this.MenuNivel2Repository.save(menu);
        }
        catch (error) {
            this.handleDbExceptions(error);
        }
    }
    handleDbExceptions(error) {
        if (error.code == 23503) {
            throw new common_1.BadRequestException(error.detail);
        }
        if (error.code == 23502) {
            throw new common_1.BadRequestException('null value in column (' + error.column + ') ' + error.detail);
        }
        this.logger.error(error);
        throw new common_1.InternalServerErrorException('Error inesperado, revisar log');
    }
};
exports.MenuNivel2Service = MenuNivel2Service;
exports.MenuNivel2Service = MenuNivel2Service = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(menu_nivel2_entity_1.MenuNivel2)),
    __param(1, (0, typeorm_1.InjectRepository)(permiso_entity_1.Permiso)),
    __param(2, (0, typeorm_1.InjectRepository)(perfil_entity_1.Perfil)),
    __param(3, (0, typeorm_1.InjectRepository)(menu_nivel1_entity_1.MenuNivel1)),
    __metadata("design:paramtypes", [typeof (_a = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _a : Object, typeof (_b = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _b : Object, typeof (_c = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _c : Object, typeof (_d = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _d : Object, typeof (_e = typeof permisos_service_1.PermisosService !== "undefined" && permisos_service_1.PermisosService) === "function" ? _e : Object])
], MenuNivel2Service);


/***/ }),
/* 106 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UpdateMenuNivel2Dto = void 0;
const swagger_1 = __webpack_require__(13);
const create_menu_nivel2_dto_1 = __webpack_require__(107);
class UpdateMenuNivel2Dto extends (0, swagger_1.PartialType)(create_menu_nivel2_dto_1.CreateMenuNivel2Dto) {
}
exports.UpdateMenuNivel2Dto = UpdateMenuNivel2Dto;


/***/ }),
/* 107 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreateMenuNivel2Dto = void 0;
const swagger_1 = __webpack_require__(13);
const class_validator_1 = __webpack_require__(25);
class CreateMenuNivel2Dto {
}
exports.CreateMenuNivel2Dto = CreateMenuNivel2Dto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: "Usuarios" }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateMenuNivel2Dto.prototype, "nombre", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "Gestión de usuarios", required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateMenuNivel2Dto.prototype, "descripcion", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: true, default: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateMenuNivel2Dto.prototype, "estado", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "usuarios", required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateMenuNivel2Dto.prototype, "ruta", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "people", required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateMenuNivel2Dto.prototype, "icon", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1, description: "ID del menú nivel 1 al que pertenece" }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateMenuNivel2Dto.prototype, "menu1Id", void 0);


/***/ }),
/* 108 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MenuNivel2Controller = void 0;
const common_1 = __webpack_require__(6);
const menu_nivel2_service_1 = __webpack_require__(105);
const create_menu_nivel2_dto_1 = __webpack_require__(107);
const update_menu_nivel2_dto_1 = __webpack_require__(106);
const swagger_1 = __webpack_require__(13);
const passport_1 = __webpack_require__(27);
let MenuNivel2Controller = class MenuNivel2Controller {
    constructor(menuNivel2Service) {
        this.menuNivel2Service = menuNivel2Service;
    }
    create(createMenuNivel2Dto) {
        return this.menuNivel2Service.create(createMenuNivel2Dto);
    }
    findAll() {
        return this.menuNivel2Service.findAll();
    }
    findOne(id) {
        return this.menuNivel2Service.findOne(id);
    }
    update(id, updateMenuNivel2Dto) {
        return this.menuNivel2Service.update(+id, updateMenuNivel2Dto);
    }
    findByMenu1(menuNivel1Id) {
        return this.menuNivel2Service.findByMenuNivel1(menuNivel1Id);
    }
    remove(id) {
        return this.menuNivel2Service.remove(+id);
    }
};
exports.MenuNivel2Controller = MenuNivel2Controller;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof create_menu_nivel2_dto_1.CreateMenuNivel2Dto !== "undefined" && create_menu_nivel2_dto_1.CreateMenuNivel2Dto) === "function" ? _b : Object]),
    __metadata("design:returntype", void 0)
], MenuNivel2Controller.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], MenuNivel2Controller.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], MenuNivel2Controller.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_c = typeof update_menu_nivel2_dto_1.UpdateMenuNivel2Dto !== "undefined" && update_menu_nivel2_dto_1.UpdateMenuNivel2Dto) === "function" ? _c : Object]),
    __metadata("design:returntype", void 0)
], MenuNivel2Controller.prototype, "update", null);
__decorate([
    (0, common_1.Get)('/bymenu1/:menuNivel1Id'),
    __param(0, (0, common_1.Param)('menuNivel1Id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], MenuNivel2Controller.prototype, "findByMenu1", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MenuNivel2Controller.prototype, "remove", null);
exports.MenuNivel2Controller = MenuNivel2Controller = __decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)()),
    (0, swagger_1.ApiTags)("MenuNivel2"),
    (0, common_1.Controller)('menu-nivel2'),
    __metadata("design:paramtypes", [typeof (_a = typeof menu_nivel2_service_1.MenuNivel2Service !== "undefined" && menu_nivel2_service_1.MenuNivel2Service) === "function" ? _a : Object])
], MenuNivel2Controller);


/***/ }),
/* 109 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PermisosModule = void 0;
const common_1 = __webpack_require__(6);
const permisos_service_1 = __webpack_require__(100);
const permisos_controller_1 = __webpack_require__(110);
const typeorm_1 = __webpack_require__(7);
const menu_nivel2_entity_1 = __webpack_require__(93);
const permiso_entity_1 = __webpack_require__(92);
const auth_module_1 = __webpack_require__(28);
const menu_nivel1_entity_1 = __webpack_require__(94);
const perfil_entity_1 = __webpack_require__(91);
let PermisosModule = class PermisosModule {
};
exports.PermisosModule = PermisosModule;
exports.PermisosModule = PermisosModule = __decorate([
    (0, common_1.Module)({
        controllers: [permisos_controller_1.PermisosController],
        providers: [permisos_service_1.PermisosService],
        imports: [typeorm_1.TypeOrmModule.forFeature([menu_nivel2_entity_1.MenuNivel2, menu_nivel1_entity_1.MenuNivel1, permiso_entity_1.Permiso, perfil_entity_1.Perfil]), auth_module_1.AuthModule],
    })
], PermisosModule);


/***/ }),
/* 110 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PermisosController = void 0;
const common_1 = __webpack_require__(6);
const swagger_1 = __webpack_require__(13);
const permisos_service_1 = __webpack_require__(100);
const update_permiso_dto_1 = __webpack_require__(111);
let PermisosController = class PermisosController {
    constructor(permisoService) {
        this.permisoService = permisoService;
    }
    getPermisosPorPerfil(perfilId) {
        return this.permisoService.getPermisosPorPerfil(perfilId);
    }
    getPermisosActivosPorPerfil(perfilId) {
        return this.permisoService.getPermisosActivosPorPerfil(perfilId);
    }
    updatePermiso(id, dto) {
        return this.permisoService.update(id, dto);
    }
};
exports.PermisosController = PermisosController;
__decorate([
    (0, common_1.Get)('perfil/:perfilId'),
    __param(0, (0, common_1.Param)('perfilId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], PermisosController.prototype, "getPermisosPorPerfil", null);
__decorate([
    (0, common_1.Get)('perfilactivo/:perfilId'),
    __param(0, (0, common_1.Param)('perfilId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], PermisosController.prototype, "getPermisosActivosPorPerfil", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, typeof (_b = typeof update_permiso_dto_1.UpdatePermisoDto !== "undefined" && update_permiso_dto_1.UpdatePermisoDto) === "function" ? _b : Object]),
    __metadata("design:returntype", void 0)
], PermisosController.prototype, "updatePermiso", null);
exports.PermisosController = PermisosController = __decorate([
    (0, swagger_1.ApiTags)('Permisos'),
    (0, common_1.Controller)('permisos'),
    __metadata("design:paramtypes", [typeof (_a = typeof permisos_service_1.PermisosService !== "undefined" && permisos_service_1.PermisosService) === "function" ? _a : Object])
], PermisosController);


/***/ }),
/* 111 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UpdatePermisoDto = void 0;
const swagger_1 = __webpack_require__(13);
const class_validator_1 = __webpack_require__(25);
class UpdatePermisoDto {
}
exports.UpdatePermisoDto = UpdatePermisoDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: true }),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdatePermisoDto.prototype, "habilitado", void 0);


/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			if (cachedModule.error !== undefined) throw cachedModule.error;
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		try {
/******/ 			var execOptions = { id: moduleId, module: module, factory: __webpack_modules__[moduleId], require: __webpack_require__ };
/******/ 			__webpack_require__.i.forEach(function(handler) { handler(execOptions); });
/******/ 			module = execOptions.module;
/******/ 			execOptions.factory.call(module.exports, module, module.exports, execOptions.require);
/******/ 		} catch(e) {
/******/ 			module.error = e;
/******/ 			throw e;
/******/ 		}
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = __webpack_module_cache__;
/******/ 	
/******/ 	// expose the module execution interceptor
/******/ 	__webpack_require__.i = [];
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/get javascript update chunk filename */
/******/ 	(() => {
/******/ 		// This function allow to reference all chunks
/******/ 		__webpack_require__.hu = (chunkId) => {
/******/ 			// return url for filenames based on template
/******/ 			return "" + chunkId + "." + __webpack_require__.h() + ".hot-update.js";
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/get update manifest filename */
/******/ 	(() => {
/******/ 		__webpack_require__.hmrF = () => ("main." + __webpack_require__.h() + ".hot-update.json");
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/getFullHash */
/******/ 	(() => {
/******/ 		__webpack_require__.h = () => ("fabb5de43eabec207487")
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hot module replacement */
/******/ 	(() => {
/******/ 		var currentModuleData = {};
/******/ 		var installedModules = __webpack_require__.c;
/******/ 		
/******/ 		// module and require creation
/******/ 		var currentChildModule;
/******/ 		var currentParents = [];
/******/ 		
/******/ 		// status
/******/ 		var registeredStatusHandlers = [];
/******/ 		var currentStatus = "idle";
/******/ 		
/******/ 		// while downloading
/******/ 		var blockingPromises = 0;
/******/ 		var blockingPromisesWaiting = [];
/******/ 		
/******/ 		// The update info
/******/ 		var currentUpdateApplyHandlers;
/******/ 		var queuedInvalidatedModules;
/******/ 		
/******/ 		__webpack_require__.hmrD = currentModuleData;
/******/ 		
/******/ 		__webpack_require__.i.push(function (options) {
/******/ 			var module = options.module;
/******/ 			var require = createRequire(options.require, options.id);
/******/ 			module.hot = createModuleHotObject(options.id, module);
/******/ 			module.parents = currentParents;
/******/ 			module.children = [];
/******/ 			currentParents = [];
/******/ 			options.require = require;
/******/ 		});
/******/ 		
/******/ 		__webpack_require__.hmrC = {};
/******/ 		__webpack_require__.hmrI = {};
/******/ 		
/******/ 		function createRequire(require, moduleId) {
/******/ 			var me = installedModules[moduleId];
/******/ 			if (!me) return require;
/******/ 			var fn = function (request) {
/******/ 				if (me.hot.active) {
/******/ 					if (installedModules[request]) {
/******/ 						var parents = installedModules[request].parents;
/******/ 						if (parents.indexOf(moduleId) === -1) {
/******/ 							parents.push(moduleId);
/******/ 						}
/******/ 					} else {
/******/ 						currentParents = [moduleId];
/******/ 						currentChildModule = request;
/******/ 					}
/******/ 					if (me.children.indexOf(request) === -1) {
/******/ 						me.children.push(request);
/******/ 					}
/******/ 				} else {
/******/ 					console.warn(
/******/ 						"[HMR] unexpected require(" +
/******/ 							request +
/******/ 							") from disposed module " +
/******/ 							moduleId
/******/ 					);
/******/ 					currentParents = [];
/******/ 				}
/******/ 				return require(request);
/******/ 			};
/******/ 			var createPropertyDescriptor = function (name) {
/******/ 				return {
/******/ 					configurable: true,
/******/ 					enumerable: true,
/******/ 					get: function () {
/******/ 						return require[name];
/******/ 					},
/******/ 					set: function (value) {
/******/ 						require[name] = value;
/******/ 					}
/******/ 				};
/******/ 			};
/******/ 			for (var name in require) {
/******/ 				if (Object.prototype.hasOwnProperty.call(require, name) && name !== "e") {
/******/ 					Object.defineProperty(fn, name, createPropertyDescriptor(name));
/******/ 				}
/******/ 			}
/******/ 			fn.e = function (chunkId, fetchPriority) {
/******/ 				return trackBlockingPromise(require.e(chunkId, fetchPriority));
/******/ 			};
/******/ 			return fn;
/******/ 		}
/******/ 		
/******/ 		function createModuleHotObject(moduleId, me) {
/******/ 			var _main = currentChildModule !== moduleId;
/******/ 			var hot = {
/******/ 				// private stuff
/******/ 				_acceptedDependencies: {},
/******/ 				_acceptedErrorHandlers: {},
/******/ 				_declinedDependencies: {},
/******/ 				_selfAccepted: false,
/******/ 				_selfDeclined: false,
/******/ 				_selfInvalidated: false,
/******/ 				_disposeHandlers: [],
/******/ 				_main: _main,
/******/ 				_requireSelf: function () {
/******/ 					currentParents = me.parents.slice();
/******/ 					currentChildModule = _main ? undefined : moduleId;
/******/ 					__webpack_require__(moduleId);
/******/ 				},
/******/ 		
/******/ 				// Module API
/******/ 				active: true,
/******/ 				accept: function (dep, callback, errorHandler) {
/******/ 					if (dep === undefined) hot._selfAccepted = true;
/******/ 					else if (typeof dep === "function") hot._selfAccepted = dep;
/******/ 					else if (typeof dep === "object" && dep !== null) {
/******/ 						for (var i = 0; i < dep.length; i++) {
/******/ 							hot._acceptedDependencies[dep[i]] = callback || function () {};
/******/ 							hot._acceptedErrorHandlers[dep[i]] = errorHandler;
/******/ 						}
/******/ 					} else {
/******/ 						hot._acceptedDependencies[dep] = callback || function () {};
/******/ 						hot._acceptedErrorHandlers[dep] = errorHandler;
/******/ 					}
/******/ 				},
/******/ 				decline: function (dep) {
/******/ 					if (dep === undefined) hot._selfDeclined = true;
/******/ 					else if (typeof dep === "object" && dep !== null)
/******/ 						for (var i = 0; i < dep.length; i++)
/******/ 							hot._declinedDependencies[dep[i]] = true;
/******/ 					else hot._declinedDependencies[dep] = true;
/******/ 				},
/******/ 				dispose: function (callback) {
/******/ 					hot._disposeHandlers.push(callback);
/******/ 				},
/******/ 				addDisposeHandler: function (callback) {
/******/ 					hot._disposeHandlers.push(callback);
/******/ 				},
/******/ 				removeDisposeHandler: function (callback) {
/******/ 					var idx = hot._disposeHandlers.indexOf(callback);
/******/ 					if (idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 				},
/******/ 				invalidate: function () {
/******/ 					this._selfInvalidated = true;
/******/ 					switch (currentStatus) {
/******/ 						case "idle":
/******/ 							currentUpdateApplyHandlers = [];
/******/ 							Object.keys(__webpack_require__.hmrI).forEach(function (key) {
/******/ 								__webpack_require__.hmrI[key](
/******/ 									moduleId,
/******/ 									currentUpdateApplyHandlers
/******/ 								);
/******/ 							});
/******/ 							setStatus("ready");
/******/ 							break;
/******/ 						case "ready":
/******/ 							Object.keys(__webpack_require__.hmrI).forEach(function (key) {
/******/ 								__webpack_require__.hmrI[key](
/******/ 									moduleId,
/******/ 									currentUpdateApplyHandlers
/******/ 								);
/******/ 							});
/******/ 							break;
/******/ 						case "prepare":
/******/ 						case "check":
/******/ 						case "dispose":
/******/ 						case "apply":
/******/ 							(queuedInvalidatedModules = queuedInvalidatedModules || []).push(
/******/ 								moduleId
/******/ 							);
/******/ 							break;
/******/ 						default:
/******/ 							// ignore requests in error states
/******/ 							break;
/******/ 					}
/******/ 				},
/******/ 		
/******/ 				// Management API
/******/ 				check: hotCheck,
/******/ 				apply: hotApply,
/******/ 				status: function (l) {
/******/ 					if (!l) return currentStatus;
/******/ 					registeredStatusHandlers.push(l);
/******/ 				},
/******/ 				addStatusHandler: function (l) {
/******/ 					registeredStatusHandlers.push(l);
/******/ 				},
/******/ 				removeStatusHandler: function (l) {
/******/ 					var idx = registeredStatusHandlers.indexOf(l);
/******/ 					if (idx >= 0) registeredStatusHandlers.splice(idx, 1);
/******/ 				},
/******/ 		
/******/ 				//inherit from previous dispose call
/******/ 				data: currentModuleData[moduleId]
/******/ 			};
/******/ 			currentChildModule = undefined;
/******/ 			return hot;
/******/ 		}
/******/ 		
/******/ 		function setStatus(newStatus) {
/******/ 			currentStatus = newStatus;
/******/ 			var results = [];
/******/ 		
/******/ 			for (var i = 0; i < registeredStatusHandlers.length; i++)
/******/ 				results[i] = registeredStatusHandlers[i].call(null, newStatus);
/******/ 		
/******/ 			return Promise.all(results).then(function () {});
/******/ 		}
/******/ 		
/******/ 		function unblock() {
/******/ 			if (--blockingPromises === 0) {
/******/ 				setStatus("ready").then(function () {
/******/ 					if (blockingPromises === 0) {
/******/ 						var list = blockingPromisesWaiting;
/******/ 						blockingPromisesWaiting = [];
/******/ 						for (var i = 0; i < list.length; i++) {
/******/ 							list[i]();
/******/ 						}
/******/ 					}
/******/ 				});
/******/ 			}
/******/ 		}
/******/ 		
/******/ 		function trackBlockingPromise(promise) {
/******/ 			switch (currentStatus) {
/******/ 				case "ready":
/******/ 					setStatus("prepare");
/******/ 				/* fallthrough */
/******/ 				case "prepare":
/******/ 					blockingPromises++;
/******/ 					promise.then(unblock, unblock);
/******/ 					return promise;
/******/ 				default:
/******/ 					return promise;
/******/ 			}
/******/ 		}
/******/ 		
/******/ 		function waitForBlockingPromises(fn) {
/******/ 			if (blockingPromises === 0) return fn();
/******/ 			return new Promise(function (resolve) {
/******/ 				blockingPromisesWaiting.push(function () {
/******/ 					resolve(fn());
/******/ 				});
/******/ 			});
/******/ 		}
/******/ 		
/******/ 		function hotCheck(applyOnUpdate) {
/******/ 			if (currentStatus !== "idle") {
/******/ 				throw new Error("check() is only allowed in idle status");
/******/ 			}
/******/ 			return setStatus("check")
/******/ 				.then(__webpack_require__.hmrM)
/******/ 				.then(function (update) {
/******/ 					if (!update) {
/******/ 						return setStatus(applyInvalidatedModules() ? "ready" : "idle").then(
/******/ 							function () {
/******/ 								return null;
/******/ 							}
/******/ 						);
/******/ 					}
/******/ 		
/******/ 					return setStatus("prepare").then(function () {
/******/ 						var updatedModules = [];
/******/ 						currentUpdateApplyHandlers = [];
/******/ 		
/******/ 						return Promise.all(
/******/ 							Object.keys(__webpack_require__.hmrC).reduce(function (
/******/ 								promises,
/******/ 								key
/******/ 							) {
/******/ 								__webpack_require__.hmrC[key](
/******/ 									update.c,
/******/ 									update.r,
/******/ 									update.m,
/******/ 									promises,
/******/ 									currentUpdateApplyHandlers,
/******/ 									updatedModules
/******/ 								);
/******/ 								return promises;
/******/ 							}, [])
/******/ 						).then(function () {
/******/ 							return waitForBlockingPromises(function () {
/******/ 								if (applyOnUpdate) {
/******/ 									return internalApply(applyOnUpdate);
/******/ 								} else {
/******/ 									return setStatus("ready").then(function () {
/******/ 										return updatedModules;
/******/ 									});
/******/ 								}
/******/ 							});
/******/ 						});
/******/ 					});
/******/ 				});
/******/ 		}
/******/ 		
/******/ 		function hotApply(options) {
/******/ 			if (currentStatus !== "ready") {
/******/ 				return Promise.resolve().then(function () {
/******/ 					throw new Error(
/******/ 						"apply() is only allowed in ready status (state: " +
/******/ 							currentStatus +
/******/ 							")"
/******/ 					);
/******/ 				});
/******/ 			}
/******/ 			return internalApply(options);
/******/ 		}
/******/ 		
/******/ 		function internalApply(options) {
/******/ 			options = options || {};
/******/ 		
/******/ 			applyInvalidatedModules();
/******/ 		
/******/ 			var results = currentUpdateApplyHandlers.map(function (handler) {
/******/ 				return handler(options);
/******/ 			});
/******/ 			currentUpdateApplyHandlers = undefined;
/******/ 		
/******/ 			var errors = results
/******/ 				.map(function (r) {
/******/ 					return r.error;
/******/ 				})
/******/ 				.filter(Boolean);
/******/ 		
/******/ 			if (errors.length > 0) {
/******/ 				return setStatus("abort").then(function () {
/******/ 					throw errors[0];
/******/ 				});
/******/ 			}
/******/ 		
/******/ 			// Now in "dispose" phase
/******/ 			var disposePromise = setStatus("dispose");
/******/ 		
/******/ 			results.forEach(function (result) {
/******/ 				if (result.dispose) result.dispose();
/******/ 			});
/******/ 		
/******/ 			// Now in "apply" phase
/******/ 			var applyPromise = setStatus("apply");
/******/ 		
/******/ 			var error;
/******/ 			var reportError = function (err) {
/******/ 				if (!error) error = err;
/******/ 			};
/******/ 		
/******/ 			var outdatedModules = [];
/******/ 			results.forEach(function (result) {
/******/ 				if (result.apply) {
/******/ 					var modules = result.apply(reportError);
/******/ 					if (modules) {
/******/ 						for (var i = 0; i < modules.length; i++) {
/******/ 							outdatedModules.push(modules[i]);
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			});
/******/ 		
/******/ 			return Promise.all([disposePromise, applyPromise]).then(function () {
/******/ 				// handle errors in accept handlers and self accepted module load
/******/ 				if (error) {
/******/ 					return setStatus("fail").then(function () {
/******/ 						throw error;
/******/ 					});
/******/ 				}
/******/ 		
/******/ 				if (queuedInvalidatedModules) {
/******/ 					return internalApply(options).then(function (list) {
/******/ 						outdatedModules.forEach(function (moduleId) {
/******/ 							if (list.indexOf(moduleId) < 0) list.push(moduleId);
/******/ 						});
/******/ 						return list;
/******/ 					});
/******/ 				}
/******/ 		
/******/ 				return setStatus("idle").then(function () {
/******/ 					return outdatedModules;
/******/ 				});
/******/ 			});
/******/ 		}
/******/ 		
/******/ 		function applyInvalidatedModules() {
/******/ 			if (queuedInvalidatedModules) {
/******/ 				if (!currentUpdateApplyHandlers) currentUpdateApplyHandlers = [];
/******/ 				Object.keys(__webpack_require__.hmrI).forEach(function (key) {
/******/ 					queuedInvalidatedModules.forEach(function (moduleId) {
/******/ 						__webpack_require__.hmrI[key](
/******/ 							moduleId,
/******/ 							currentUpdateApplyHandlers
/******/ 						);
/******/ 					});
/******/ 				});
/******/ 				queuedInvalidatedModules = undefined;
/******/ 				return true;
/******/ 			}
/******/ 		}
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/require chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded chunks
/******/ 		// "1" means "loaded", otherwise not loaded yet
/******/ 		var installedChunks = __webpack_require__.hmrS_require = __webpack_require__.hmrS_require || {
/******/ 			0: 1
/******/ 		};
/******/ 		
/******/ 		// no on chunks loaded
/******/ 		
/******/ 		// no chunk install function needed
/******/ 		
/******/ 		// no chunk loading
/******/ 		
/******/ 		// no external install chunk
/******/ 		
/******/ 		function loadUpdateChunk(chunkId, updatedModulesList) {
/******/ 			var update = require("./" + __webpack_require__.hu(chunkId));
/******/ 			var updatedModules = update.modules;
/******/ 			var runtime = update.runtime;
/******/ 			for(var moduleId in updatedModules) {
/******/ 				if(__webpack_require__.o(updatedModules, moduleId)) {
/******/ 					currentUpdate[moduleId] = updatedModules[moduleId];
/******/ 					if(updatedModulesList) updatedModulesList.push(moduleId);
/******/ 				}
/******/ 			}
/******/ 			if(runtime) currentUpdateRuntime.push(runtime);
/******/ 		}
/******/ 		
/******/ 		var currentUpdateChunks;
/******/ 		var currentUpdate;
/******/ 		var currentUpdateRemovedChunks;
/******/ 		var currentUpdateRuntime;
/******/ 		function applyHandler(options) {
/******/ 			if (__webpack_require__.f) delete __webpack_require__.f.requireHmr;
/******/ 			currentUpdateChunks = undefined;
/******/ 			function getAffectedModuleEffects(updateModuleId) {
/******/ 				var outdatedModules = [updateModuleId];
/******/ 				var outdatedDependencies = {};
/******/ 		
/******/ 				var queue = outdatedModules.map(function (id) {
/******/ 					return {
/******/ 						chain: [id],
/******/ 						id: id
/******/ 					};
/******/ 				});
/******/ 				while (queue.length > 0) {
/******/ 					var queueItem = queue.pop();
/******/ 					var moduleId = queueItem.id;
/******/ 					var chain = queueItem.chain;
/******/ 					var module = __webpack_require__.c[moduleId];
/******/ 					if (
/******/ 						!module ||
/******/ 						(module.hot._selfAccepted && !module.hot._selfInvalidated)
/******/ 					)
/******/ 						continue;
/******/ 					if (module.hot._selfDeclined) {
/******/ 						return {
/******/ 							type: "self-declined",
/******/ 							chain: chain,
/******/ 							moduleId: moduleId
/******/ 						};
/******/ 					}
/******/ 					if (module.hot._main) {
/******/ 						return {
/******/ 							type: "unaccepted",
/******/ 							chain: chain,
/******/ 							moduleId: moduleId
/******/ 						};
/******/ 					}
/******/ 					for (var i = 0; i < module.parents.length; i++) {
/******/ 						var parentId = module.parents[i];
/******/ 						var parent = __webpack_require__.c[parentId];
/******/ 						if (!parent) continue;
/******/ 						if (parent.hot._declinedDependencies[moduleId]) {
/******/ 							return {
/******/ 								type: "declined",
/******/ 								chain: chain.concat([parentId]),
/******/ 								moduleId: moduleId,
/******/ 								parentId: parentId
/******/ 							};
/******/ 						}
/******/ 						if (outdatedModules.indexOf(parentId) !== -1) continue;
/******/ 						if (parent.hot._acceptedDependencies[moduleId]) {
/******/ 							if (!outdatedDependencies[parentId])
/******/ 								outdatedDependencies[parentId] = [];
/******/ 							addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 							continue;
/******/ 						}
/******/ 						delete outdatedDependencies[parentId];
/******/ 						outdatedModules.push(parentId);
/******/ 						queue.push({
/******/ 							chain: chain.concat([parentId]),
/******/ 							id: parentId
/******/ 						});
/******/ 					}
/******/ 				}
/******/ 		
/******/ 				return {
/******/ 					type: "accepted",
/******/ 					moduleId: updateModuleId,
/******/ 					outdatedModules: outdatedModules,
/******/ 					outdatedDependencies: outdatedDependencies
/******/ 				};
/******/ 			}
/******/ 		
/******/ 			function addAllToSet(a, b) {
/******/ 				for (var i = 0; i < b.length; i++) {
/******/ 					var item = b[i];
/******/ 					if (a.indexOf(item) === -1) a.push(item);
/******/ 				}
/******/ 			}
/******/ 		
/******/ 			// at begin all updates modules are outdated
/******/ 			// the "outdated" status can propagate to parents if they don't accept the children
/******/ 			var outdatedDependencies = {};
/******/ 			var outdatedModules = [];
/******/ 			var appliedUpdate = {};
/******/ 		
/******/ 			var warnUnexpectedRequire = function warnUnexpectedRequire(module) {
/******/ 				console.warn(
/******/ 					"[HMR] unexpected require(" + module.id + ") to disposed module"
/******/ 				);
/******/ 			};
/******/ 		
/******/ 			for (var moduleId in currentUpdate) {
/******/ 				if (__webpack_require__.o(currentUpdate, moduleId)) {
/******/ 					var newModuleFactory = currentUpdate[moduleId];
/******/ 					/** @type {TODO} */
/******/ 					var result;
/******/ 					if (newModuleFactory) {
/******/ 						result = getAffectedModuleEffects(moduleId);
/******/ 					} else {
/******/ 						result = {
/******/ 							type: "disposed",
/******/ 							moduleId: moduleId
/******/ 						};
/******/ 					}
/******/ 					/** @type {Error|false} */
/******/ 					var abortError = false;
/******/ 					var doApply = false;
/******/ 					var doDispose = false;
/******/ 					var chainInfo = "";
/******/ 					if (result.chain) {
/******/ 						chainInfo = "\nUpdate propagation: " + result.chain.join(" -> ");
/******/ 					}
/******/ 					switch (result.type) {
/******/ 						case "self-declined":
/******/ 							if (options.onDeclined) options.onDeclined(result);
/******/ 							if (!options.ignoreDeclined)
/******/ 								abortError = new Error(
/******/ 									"Aborted because of self decline: " +
/******/ 										result.moduleId +
/******/ 										chainInfo
/******/ 								);
/******/ 							break;
/******/ 						case "declined":
/******/ 							if (options.onDeclined) options.onDeclined(result);
/******/ 							if (!options.ignoreDeclined)
/******/ 								abortError = new Error(
/******/ 									"Aborted because of declined dependency: " +
/******/ 										result.moduleId +
/******/ 										" in " +
/******/ 										result.parentId +
/******/ 										chainInfo
/******/ 								);
/******/ 							break;
/******/ 						case "unaccepted":
/******/ 							if (options.onUnaccepted) options.onUnaccepted(result);
/******/ 							if (!options.ignoreUnaccepted)
/******/ 								abortError = new Error(
/******/ 									"Aborted because " + moduleId + " is not accepted" + chainInfo
/******/ 								);
/******/ 							break;
/******/ 						case "accepted":
/******/ 							if (options.onAccepted) options.onAccepted(result);
/******/ 							doApply = true;
/******/ 							break;
/******/ 						case "disposed":
/******/ 							if (options.onDisposed) options.onDisposed(result);
/******/ 							doDispose = true;
/******/ 							break;
/******/ 						default:
/******/ 							throw new Error("Unexception type " + result.type);
/******/ 					}
/******/ 					if (abortError) {
/******/ 						return {
/******/ 							error: abortError
/******/ 						};
/******/ 					}
/******/ 					if (doApply) {
/******/ 						appliedUpdate[moduleId] = newModuleFactory;
/******/ 						addAllToSet(outdatedModules, result.outdatedModules);
/******/ 						for (moduleId in result.outdatedDependencies) {
/******/ 							if (__webpack_require__.o(result.outdatedDependencies, moduleId)) {
/******/ 								if (!outdatedDependencies[moduleId])
/******/ 									outdatedDependencies[moduleId] = [];
/******/ 								addAllToSet(
/******/ 									outdatedDependencies[moduleId],
/******/ 									result.outdatedDependencies[moduleId]
/******/ 								);
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 					if (doDispose) {
/******/ 						addAllToSet(outdatedModules, [result.moduleId]);
/******/ 						appliedUpdate[moduleId] = warnUnexpectedRequire;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 			currentUpdate = undefined;
/******/ 		
/******/ 			// Store self accepted outdated modules to require them later by the module system
/******/ 			var outdatedSelfAcceptedModules = [];
/******/ 			for (var j = 0; j < outdatedModules.length; j++) {
/******/ 				var outdatedModuleId = outdatedModules[j];
/******/ 				var module = __webpack_require__.c[outdatedModuleId];
/******/ 				if (
/******/ 					module &&
/******/ 					(module.hot._selfAccepted || module.hot._main) &&
/******/ 					// removed self-accepted modules should not be required
/******/ 					appliedUpdate[outdatedModuleId] !== warnUnexpectedRequire &&
/******/ 					// when called invalidate self-accepting is not possible
/******/ 					!module.hot._selfInvalidated
/******/ 				) {
/******/ 					outdatedSelfAcceptedModules.push({
/******/ 						module: outdatedModuleId,
/******/ 						require: module.hot._requireSelf,
/******/ 						errorHandler: module.hot._selfAccepted
/******/ 					});
/******/ 				}
/******/ 			}
/******/ 		
/******/ 			var moduleOutdatedDependencies;
/******/ 		
/******/ 			return {
/******/ 				dispose: function () {
/******/ 					currentUpdateRemovedChunks.forEach(function (chunkId) {
/******/ 						delete installedChunks[chunkId];
/******/ 					});
/******/ 					currentUpdateRemovedChunks = undefined;
/******/ 		
/******/ 					var idx;
/******/ 					var queue = outdatedModules.slice();
/******/ 					while (queue.length > 0) {
/******/ 						var moduleId = queue.pop();
/******/ 						var module = __webpack_require__.c[moduleId];
/******/ 						if (!module) continue;
/******/ 		
/******/ 						var data = {};
/******/ 		
/******/ 						// Call dispose handlers
/******/ 						var disposeHandlers = module.hot._disposeHandlers;
/******/ 						for (j = 0; j < disposeHandlers.length; j++) {
/******/ 							disposeHandlers[j].call(null, data);
/******/ 						}
/******/ 						__webpack_require__.hmrD[moduleId] = data;
/******/ 		
/******/ 						// disable module (this disables requires from this module)
/******/ 						module.hot.active = false;
/******/ 		
/******/ 						// remove module from cache
/******/ 						delete __webpack_require__.c[moduleId];
/******/ 		
/******/ 						// when disposing there is no need to call dispose handler
/******/ 						delete outdatedDependencies[moduleId];
/******/ 		
/******/ 						// remove "parents" references from all children
/******/ 						for (j = 0; j < module.children.length; j++) {
/******/ 							var child = __webpack_require__.c[module.children[j]];
/******/ 							if (!child) continue;
/******/ 							idx = child.parents.indexOf(moduleId);
/******/ 							if (idx >= 0) {
/******/ 								child.parents.splice(idx, 1);
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 		
/******/ 					// remove outdated dependency from module children
/******/ 					var dependency;
/******/ 					for (var outdatedModuleId in outdatedDependencies) {
/******/ 						if (__webpack_require__.o(outdatedDependencies, outdatedModuleId)) {
/******/ 							module = __webpack_require__.c[outdatedModuleId];
/******/ 							if (module) {
/******/ 								moduleOutdatedDependencies =
/******/ 									outdatedDependencies[outdatedModuleId];
/******/ 								for (j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 									dependency = moduleOutdatedDependencies[j];
/******/ 									idx = module.children.indexOf(dependency);
/******/ 									if (idx >= 0) module.children.splice(idx, 1);
/******/ 								}
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 				},
/******/ 				apply: function (reportError) {
/******/ 					// insert new code
/******/ 					for (var updateModuleId in appliedUpdate) {
/******/ 						if (__webpack_require__.o(appliedUpdate, updateModuleId)) {
/******/ 							__webpack_require__.m[updateModuleId] = appliedUpdate[updateModuleId];
/******/ 						}
/******/ 					}
/******/ 		
/******/ 					// run new runtime modules
/******/ 					for (var i = 0; i < currentUpdateRuntime.length; i++) {
/******/ 						currentUpdateRuntime[i](__webpack_require__);
/******/ 					}
/******/ 		
/******/ 					// call accept handlers
/******/ 					for (var outdatedModuleId in outdatedDependencies) {
/******/ 						if (__webpack_require__.o(outdatedDependencies, outdatedModuleId)) {
/******/ 							var module = __webpack_require__.c[outdatedModuleId];
/******/ 							if (module) {
/******/ 								moduleOutdatedDependencies =
/******/ 									outdatedDependencies[outdatedModuleId];
/******/ 								var callbacks = [];
/******/ 								var errorHandlers = [];
/******/ 								var dependenciesForCallbacks = [];
/******/ 								for (var j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 									var dependency = moduleOutdatedDependencies[j];
/******/ 									var acceptCallback =
/******/ 										module.hot._acceptedDependencies[dependency];
/******/ 									var errorHandler =
/******/ 										module.hot._acceptedErrorHandlers[dependency];
/******/ 									if (acceptCallback) {
/******/ 										if (callbacks.indexOf(acceptCallback) !== -1) continue;
/******/ 										callbacks.push(acceptCallback);
/******/ 										errorHandlers.push(errorHandler);
/******/ 										dependenciesForCallbacks.push(dependency);
/******/ 									}
/******/ 								}
/******/ 								for (var k = 0; k < callbacks.length; k++) {
/******/ 									try {
/******/ 										callbacks[k].call(null, moduleOutdatedDependencies);
/******/ 									} catch (err) {
/******/ 										if (typeof errorHandlers[k] === "function") {
/******/ 											try {
/******/ 												errorHandlers[k](err, {
/******/ 													moduleId: outdatedModuleId,
/******/ 													dependencyId: dependenciesForCallbacks[k]
/******/ 												});
/******/ 											} catch (err2) {
/******/ 												if (options.onErrored) {
/******/ 													options.onErrored({
/******/ 														type: "accept-error-handler-errored",
/******/ 														moduleId: outdatedModuleId,
/******/ 														dependencyId: dependenciesForCallbacks[k],
/******/ 														error: err2,
/******/ 														originalError: err
/******/ 													});
/******/ 												}
/******/ 												if (!options.ignoreErrored) {
/******/ 													reportError(err2);
/******/ 													reportError(err);
/******/ 												}
/******/ 											}
/******/ 										} else {
/******/ 											if (options.onErrored) {
/******/ 												options.onErrored({
/******/ 													type: "accept-errored",
/******/ 													moduleId: outdatedModuleId,
/******/ 													dependencyId: dependenciesForCallbacks[k],
/******/ 													error: err
/******/ 												});
/******/ 											}
/******/ 											if (!options.ignoreErrored) {
/******/ 												reportError(err);
/******/ 											}
/******/ 										}
/******/ 									}
/******/ 								}
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 		
/******/ 					// Load self accepted modules
/******/ 					for (var o = 0; o < outdatedSelfAcceptedModules.length; o++) {
/******/ 						var item = outdatedSelfAcceptedModules[o];
/******/ 						var moduleId = item.module;
/******/ 						try {
/******/ 							item.require(moduleId);
/******/ 						} catch (err) {
/******/ 							if (typeof item.errorHandler === "function") {
/******/ 								try {
/******/ 									item.errorHandler(err, {
/******/ 										moduleId: moduleId,
/******/ 										module: __webpack_require__.c[moduleId]
/******/ 									});
/******/ 								} catch (err2) {
/******/ 									if (options.onErrored) {
/******/ 										options.onErrored({
/******/ 											type: "self-accept-error-handler-errored",
/******/ 											moduleId: moduleId,
/******/ 											error: err2,
/******/ 											originalError: err
/******/ 										});
/******/ 									}
/******/ 									if (!options.ignoreErrored) {
/******/ 										reportError(err2);
/******/ 										reportError(err);
/******/ 									}
/******/ 								}
/******/ 							} else {
/******/ 								if (options.onErrored) {
/******/ 									options.onErrored({
/******/ 										type: "self-accept-errored",
/******/ 										moduleId: moduleId,
/******/ 										error: err
/******/ 									});
/******/ 								}
/******/ 								if (!options.ignoreErrored) {
/******/ 									reportError(err);
/******/ 								}
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 		
/******/ 					return outdatedModules;
/******/ 				}
/******/ 			};
/******/ 		}
/******/ 		__webpack_require__.hmrI.require = function (moduleId, applyHandlers) {
/******/ 			if (!currentUpdate) {
/******/ 				currentUpdate = {};
/******/ 				currentUpdateRuntime = [];
/******/ 				currentUpdateRemovedChunks = [];
/******/ 				applyHandlers.push(applyHandler);
/******/ 			}
/******/ 			if (!__webpack_require__.o(currentUpdate, moduleId)) {
/******/ 				currentUpdate[moduleId] = __webpack_require__.m[moduleId];
/******/ 			}
/******/ 		};
/******/ 		__webpack_require__.hmrC.require = function (
/******/ 			chunkIds,
/******/ 			removedChunks,
/******/ 			removedModules,
/******/ 			promises,
/******/ 			applyHandlers,
/******/ 			updatedModulesList
/******/ 		) {
/******/ 			applyHandlers.push(applyHandler);
/******/ 			currentUpdateChunks = {};
/******/ 			currentUpdateRemovedChunks = removedChunks;
/******/ 			currentUpdate = removedModules.reduce(function (obj, key) {
/******/ 				obj[key] = false;
/******/ 				return obj;
/******/ 			}, {});
/******/ 			currentUpdateRuntime = [];
/******/ 			chunkIds.forEach(function (chunkId) {
/******/ 				if (
/******/ 					__webpack_require__.o(installedChunks, chunkId) &&
/******/ 					installedChunks[chunkId] !== undefined
/******/ 				) {
/******/ 					promises.push(loadUpdateChunk(chunkId, updatedModulesList));
/******/ 					currentUpdateChunks[chunkId] = true;
/******/ 				} else {
/******/ 					currentUpdateChunks[chunkId] = false;
/******/ 				}
/******/ 			});
/******/ 			if (__webpack_require__.f) {
/******/ 				__webpack_require__.f.requireHmr = function (chunkId, promises) {
/******/ 					if (
/******/ 						currentUpdateChunks &&
/******/ 						__webpack_require__.o(currentUpdateChunks, chunkId) &&
/******/ 						!currentUpdateChunks[chunkId]
/******/ 					) {
/******/ 						promises.push(loadUpdateChunk(chunkId));
/******/ 						currentUpdateChunks[chunkId] = true;
/******/ 					}
/******/ 				};
/******/ 			}
/******/ 		};
/******/ 		
/******/ 		__webpack_require__.hmrM = function() {
/******/ 			return Promise.resolve().then(function() {
/******/ 				return require("./" + __webpack_require__.hmrF());
/******/ 			})['catch'](function(err) { if(err.code !== 'MODULE_NOT_FOUND') throw err; });
/******/ 		}
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// module cache are used so entry inlining is disabled
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	__webpack_require__(0);
/******/ 	var __webpack_exports__ = __webpack_require__(3);
/******/ 	
/******/ })()
;