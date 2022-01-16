import { computed, observable, action } from 'mobx';
import { 
	UserDiv, Gender, ClassStudyType, ProductType, ClassesType, 
	CurriculumType, SubjectType, ExtraActivityType, ClassSettingItem, 
	DeviceInfo, ClassSettingItemFile
} from '../types';
import Account from '../manager/Account';
import { getRandomInt } from '../utils/HelperFunc';
import { ClassSkinDataList } from '../constants/index';
// import axios from 'axios';

export class WSStore{
	@observable public isDvlp: boolean = false; 
	@observable public userDiv: UserDiv = UserDiv.TEACHER;
	@observable public subject: SubjectType  = SubjectType.NONE; 

	@observable public account: Account|undefined = undefined;   
	@observable public classList: ClassesType[] |undefined = undefined;
	@observable public curriculum: CurriculumType |undefined = undefined; 
	@observable public extraActivityList: ExtraActivityType[] |undefined = undefined; 

	@observable public allStudentList: Account[] |undefined = undefined;
	@observable public loginStudentList: Account[] |undefined = undefined;
	@observable public classSettings: ClassSettingItem[] |undefined = undefined; 
	@observable public access_key_id: string = '';
	@observable public secret_access_key: string = '';

	@observable public curClassId: number = 0;
	@observable public curUnitId: number = 0;
	@observable public curLessonId: number = 0;
	@observable public curBookId: number = 0;

	@observable public studentCnt: number = 0;
	@observable public entryCnt: number = 0;

	@observable public gotoClass: boolean = false;
	@observable public classOpen: boolean = false;

	@observable public UI: string = '';

	public _notifyAppStateForUnit: ((msg: any) => void)|null = null;
	public _notifyAppStateForLesson: ((msg: any) => void)|null = null;
	public _notifyAppStateForStudentList: ((msg: any) => void)|null = null;
	public _notifyClassInfo: (() => void)|null = null;
	public _notifyAllStudentList: (() => void)|null = null;
	public _notifyLoginStudentList: (() => void)|null = null;
	public _notifyClassSettings: ((msg: any) => void)|null = null;
	public _notifyClassSettingsInUnit: ((msg: any) => void)|null = null;
	public _notifyClassSettingsInLesson: ((msg: any) => void)|null = null;
	public _notifyClassSettingsForUnit: ((msg: any) => void)|null = null;
	public _notifyDevice: ((msg: any) => void)|null = null;
	public _notifyMoveBook: ((msg: any) => void)|null = null;

	constructor() {
		this.handlePostMessage = this.handlePostMessage.bind(this);
		window.addEventListener('message', this.handlePostMessage, false);
	}

	getProileImg(profile: string, gener: string) {
		if(profile === '') {
		  let ranval = getRandomInt(1, 3);
		  if(gener === Gender.FEMALE) return '/images/user/female_0'+ranval+'.png';
		  return '/images/user/male_0'+ranval+'.png';
		} else return profile;
	}

	@action
	sendPostMessage(data: any) {
		console.log('=====> sendPostMessage', data, this.isDvlp);
		if(this.isDvlp) {
			if(data.type=="getMyProfile") {
				window.setTimeout(() => { 
					this.account = new Account();

					this.account.userDiv = this.userDiv;
					this.account.gender= Gender.FEMALE;
					this.account.id = 100;
					this.account.name = "Eng_name";
					this.account.nickName = "Eng_nickname";
					this.account.birthday = "2020.01.01";
					this.account.thumbnail = ''; // this.getProileImg('', this.account.gender);
					this.account.defaultThumbnail = ''; // this.getProileImg('', this.account.gender);
					this.account.profileThumbnail = '';
					this.account.displayMode = 0;
				}, 500);
			} else if(data.type=="gotoClass") {
				this.curClassId = data.msg.classid;
				let getData = { type: 'getClassInfo', from: "content", srcFrame: 'navi', msg: {classid: data.msg.classid} }
				this.gotoClass = false; 
				this.sendPostMessage(getData);

				// let getData2 = { type: 'getClassSettings', from: "content", srcFrame: 'navi', msg: {classid: data.msg.classid} }
				// this.sendPostMessage(getData2);
			} else if(data.type=="getTeacherHomeInfo") {
				window.setTimeout(() => { 
					this.classList = [];
					for(let i = 0; i < 5; i++) {
						let classStudy: ClassStudyType = {
							orderSeq: (i+1),
							startDate: "2020.01.01",
							endDate: "2020.12.31"
						};
						const typeno = (i % 4) + 1;
						let product: ProductType = {
							id: (i+1),
							name: "Unit " + (i+1),
							period: 1,
							curriculumImage: "",
							curriculumId: (10+i),
							curriculumColor: typeno === 2 || typeno === 3 ? 'B62001' : 'B62002',
							description: ""
						}
						this.classList.push({
							id: 250 + (i+1),
							memberCount: 1,
							name: "Basic",
							study: classStudy,
							product: product
						})
					}
				}, 300);
				// axios.get(`https://cloudapi.fel40.com/teacher/_main.json?tch_idx=2111`)
				// .then(res => {
				// 	if(res.data && res.data.classList) this.classList = res.data.classList;
				// 	console.log('get this.classList', this.classList);
				// })
			} else if(data.type=="getClassInfo") {
				window.setTimeout(() => { 
					this.curriculum = {
						id: data.msg.classid,
						code: "00010001",
						depth: 2,
						depth_name: 'Level ' + data.msg.classid,
						info: '',
						div: '',
						subDiv: '',
						name: 'Level ' + data.msg.classid,
						thumbnail: '',
						childrenList: [],
					};
					for(let i = 0; i < 5; i++) {
						let unit_name = 'Unit Name' + (i+1);

						let unitcode = "00010001000"+(i+1); 
						let unit: CurriculumType = {
							id: (100 + i),
							code: unitcode,
							depth: 3,
							depth_name: 'Unit ' + (i+1),
							info: '',
							div: 'M0301',
							subDiv: '',
							name: unit_name,
							thumbnail: '',
							childrenList: [],
						};
						for(let j = 0; j < 8; j++) {
							let l_info = 'L&S';
							if(j === 1 || j === 3) l_info = 'R&W';
							else if(j === 4) l_info = 'R';
							else if(j === 5) l_info = 'W';
							else if(j === 6) l_info = 'Storytelling';
							else if(j === 7) l_info = 'Unit Test';

							let lessoncode = unitcode + "000"+(j+1); 
							// if(j === 0) lessoncode = unitcode + "0002"; 
							// else if(j === 1) lessoncode = unitcode + "0001";	

							let lesson: CurriculumType = {
								id: (1000 + j),
								code: lessoncode,
								depth: 4,
								depth_name: 'Lesson ' + (j+1),
								info: l_info,
								div: '',
								subDiv: '',
								name: j % 2 === 0 ? 'Nonfiction' : 'Fiction',
								thumbnail: '',
								childrenList: [],
							};
							for(let k = 0; k < 5; k++) {
								let step_name = 'Word';
								if(k === 1) step_name = 'Listening Comprehension';
								else if(k === 2) step_name = 'Sentence Practice';
								else if(k === 2) step_name = 'Retelling';
								else if(k === 2) step_name = 'Workbook';
								else if(k === 5) step_name = 'General Portfolio';
								let stepcode = lessoncode + "000" + (k+1); 
								// if(k === 0) stepcode = lessoncode + "0002"; 
								// else if(k === 1) stepcode = lessoncode + "0001";								
								let completed = 0; 
								let updatetime = '';
								// if(k === 0) {
								// 	completed = 1; 
								// 	updatetime = '2020-09-20 04:42:46';
								// } else if(k === 3) {
								// 	completed = 1; 
								// 	updatetime = '2020-09-20 04:42:47';
								// }
								if(j === 0) {
									completed = 1; 
									updatetime = '2020-09-20 04:42:0'+k;
								}
									
								let step: CurriculumType = {
									id: (10000 + k),
									code: stepcode,
									depth: 5,
									depth_name: step_name,
									info: 'Nonfiction 1',
									div: '',
									subDiv: '',
									name: step_name,
									thumbnail: '',
									childrenList: [],
									book: {
										id: k + 1,
										path: '',
										viewMode: 2,
										key: k + 1,
										cmsKey: k + 1,
										completed: completed, 
										updatetime: updatetime,
									},
								};
								lesson.childrenList.push(step);
							}
							unit.childrenList.push(lesson);
						}
						this.curriculum.childrenList.push(unit);
					}
					console.log('=====> this.curriculum' ,this.curriculum);

					let senddata1 = { type: 'getAllStudentsProfile',  from: "content", srcFrame: 'navi', msg: ''}
					this.sendPostMessage(senddata1);

					let senddata2 = { type: 'getExtraActivityInfo',  from: "content", srcFrame: 'navi', msg: ''}
					this.sendPostMessage(senddata2);
				}, 300);
				// axios.get(`https://cloudapi.fel40.com/teacher/_curriculum.json?tchIdx=2111&classId=251`)
				// .then(res => {
				// 	if(res.data && res.data.curriculum) this.curriculum = res.data.curriculum[0] ;
				// 	console.log('get this.curriculum', this.curriculum);
				// })
			} else if(data.type=="getAllStudentsProfile") {
				window.setTimeout(() => { 
					this.allStudentList = [];

					for(let i = 0; i < 15; i++) {
						let student = new Account();

						student.userDiv = UserDiv.STUDENT;
						student.gender = i % 2 === 0 ? Gender.FEMALE : Gender.MALE;
						student.id = 1000 + (i+1);
						student.name = "Student " + (i+1);
						student.nickName = "S " + (i+1);
						student.birthday = "2020.01.01";
						student.thumbnail = ''; // this.getProileImg('', student.gender);
						student.defaultThumbnail = ''; // this.getProileImg('', student.gender);
						student.profileThumbnail = '';
						student.displayMode = 0;

						this.allStudentList.push(student);
					}

					if(this._notifyClassInfo) this._notifyClassInfo();
				}, 500);
			} else if(data.type=="getLoginStudentsProfile") {
				window.setTimeout(() => { 
					this.loginStudentList = [];

					for(let i = 0; i < 10; i++) {
						let student = new Account();

						student.userDiv = UserDiv.STUDENT;
						student.gender = i % 2 === 0 ? Gender.FEMALE : Gender.MALE;
						student.id = 1000 + (i+1);
						student.name = "Student " + (i+1);
						student.nickName = "S " + (i+1);
						student.birthday = "2020.01.01";
						student.thumbnail = ''; // this.getProileImg('', student.gender);
						student.defaultThumbnail = ''; // this.getProileImg('', student.gender);
						student.profileThumbnail = '';
						student.displayMode = 0;

						this.loginStudentList.push(student);
					}
				}, 500);
			} else if(data.type=="getExtraActivityInfo") {
				window.setTimeout(() => { 
					this.extraActivityList = [];

					let name = '';
					let type = '';
					let order = 0;
					for(let i = 0; i < 14; i++) {
						if(i===0) {
							name = "Greeting";
							type = "B61003";
							order = 1;
						} else if(i===1) {
							name = "Feelings";
							type = "B61001";
							order = 2;
						} else if(i===2) {
							name = "Calendar";
							type = "B61001";
							order = 2;
						} else if(i===3) {
							name = "Around the World";
							type = "B61002";
							order = 3;
						} else if(i===4) {
							name = "Weather";
							type = "B61004";
							order = 3;
						} else if(i===5) {
							name = "Jobs";
							type = "B61002";
							order = 4;
						} else if(i===6) {
							name = "Feeling";
							type = "B61003";
							order = 4;
						} else if(i===7) {
							name = "Life Cycle";
							type = "B61001";
							order = 5;
						} else if(i===8) {
							name = "Numbers";
							type = "B61003";
							order = 5;
						} else if(i===9) {
							name = "Animals";
							type = "B61001";
							order = 6;
						} else if(i===10) {
							name = "Color";
							type = "B61003";
							order = 6;
						} else if(i===11) {
							name = "Season";
							type = "B61003";
							order = 7;
						} else if(i===12) {
							name = "Alphabet";
							type = "B61003";
							order = 8;
						} else if(i===13) {
							name = "Planets";
							type = "B61002";
							order = 11;
						}
						let activity : ExtraActivityType = {
							id: 100 + i,
							type: type,
							name: name,
							thumbnail: '/images/temp_extra.png',
							order: order,
							book: {
								id: 10000100 + i,
								path: '',
								viewMode: 2,
								key: 1000 + 1,
								cmsKey: 0,
								completed: 0, 
								updatetime: '',
							},
						}
						this.extraActivityList.push(activity);
					}
				}, 500);
			} else if(data.type=="getClassSettings") {
				window.setTimeout(() => { 
					this.classSettings = [];

					let groupNm = '';
					for(let i = 0; i < 5; i++) {
						let useYn = 'Y';
						if(i === 0) groupNm = 'Display Mode';
						else if(i === 1) groupNm = 'Lesson Mode';
						else if(i === 2) groupNm = 'Teacher Setting';
						else if(i === 3) groupNm = 'Student Setting';
						else if(i === 4) groupNm = 'Background Image';
						let classsetting : ClassSettingItem = {
							groupNm: groupNm,
							code: 'CC0' + (i+1) + '01',
							useYn: useYn,
							groupCd: 'CC0' + (i+1),
						};
						if(i === 4) {
							let files: ClassSettingItemFile[] = []
							for(let j = 0; j < ClassSkinDataList.length; j++) {
								files.push({
									classSettingsIdx: "24" + (i + 2 + j),
									filePath: ClassSkinDataList[j].thumbnail,
									orderNum: (j + 1) + '',
									selected: j === 9 ? 'Y' : 'N'
								});
							}
							classsetting.files = files;
						} else classsetting.classSettingsIdx = "24" + (i + 2);
						this.classSettings.push(classsetting);
					}
					console.log('=====> this.classSettings', data.msg.classid, this.classSettings, 'test', 'q123456789');

					this.access_key_id = 'test';
					this.secret_access_key = 'q123456789';

					let msg = { classid: data.msg.classid, settings: this.classSettings, access_key_id: this.access_key_id, secret_access_key: this.secret_access_key }
					if(this._notifyClassSettings) this._notifyClassSettings(msg);
					if(this._notifyClassSettingsInUnit) this._notifyClassSettingsInUnit(msg);
					if(this._notifyClassSettingsInLesson) this._notifyClassSettingsInLesson(msg);
					if(this._notifyClassSettingsForUnit) this._notifyClassSettingsForUnit(msg);
				}, 500);
			} else if(data.type=="getDevice") {
				window.setTimeout(() => { 
					let deviceinfo = {
						soudid: '',
						videoid: '',
						speakerid: '',
					};
					if(this._notifyDevice) this._notifyDevice(deviceinfo);
				}, 500);
			}
		}
		else {
			if(data.type=="gotoClass") this.gotoClass = true; 
			window.top.postMessage(data, '*');
		}
	}
	
	@action
	handlePostMessage = (evt: MessageEvent) => {
		console.log('=====> handlePostMessage', evt.data);
		var data = evt.data;
		if(data.from === "launcher") {
			if(data.type === "displayChanged") {
				if(data.msg) {
					let data = { type: 'getTeacherHomeInfo', from: "content", srcFrame: 'navi', msg: '' }
					this.sendPostMessage(data);
				}
			} else if(data.type=="notifyAppState") {
				if(data.msg.login !== undefined && data.msg.login < 20) {
					this.account = undefined;
					return;
				}
				if(data.msg.ui) {
					this.UI = data.msg.ui
				}
				if(data.msg.myInfo){
					this.account = new Account();

					this.account.id = data.msg.myInfo.id;
					this.account.userDiv = this.userDiv;
					this.account.gender= data.msg.myInfo.gender;
					this.account.name = data.msg.myInfo.name;
					this.account.nickName = data.msg.myInfo.nickName;
					this.account.birthday = data.msg.myInfo.birthday;
					this.account.thumbnail = data.msg.myInfo.thumbnail;
					this.account.defaultThumbnail = data.msg.myInfo.defaultThumbnail;
					this.account.profileThumbnail = data.msg.myInfo.profileThumbnail;
					this.account.displayMode = data.msg.myInfo.displayMode;
				}
				if(data.msg.classOpen && data.msg.classOpen === true) this.classOpen = true;
				// if(data.msg.studentCnt !== undefined && this.studentCnt !== data.msg.studentCnt) {
				// 	this.studentCnt = data.msg.studentCnt;
				// 	if(this._notifyAppStateForUnit) this._notifyAppStateForUnit(data.msg);
				// 	if(this._notifyAppStateForLesson) this._notifyAppStateForLesson(data.msg);
				// 	if(this._notifyAppStateForStudentList) this._notifyAppStateForStudentList(data.msg);
				// }
				if(data.msg.entryCnt !== undefined && this.entryCnt !== data.msg.entryCnt) {
					this.entryCnt = data.msg.entryCnt;
					if(this._notifyAppStateForUnit) this._notifyAppStateForUnit(data.msg);
					if(this._notifyAppStateForLesson) this._notifyAppStateForLesson(data.msg);
					if(this._notifyAppStateForStudentList) this._notifyAppStateForStudentList(data.msg);
				}
				
				if(this.gotoClass && data.msg.classid !== undefined && data.msg.classid > 0) {
					this.curClassId = data.msg.classid;
					let getData = { type: 'getClassInfo', from: "content", srcFrame: 'navi', msg: {classid: data.msg.classid} }
					this.sendPostMessage(getData);
					this.gotoClass = false; 

					// let getData2 = { type: 'getClassSettings', from: "content", srcFrame: 'navi', msg: {classid: data.msg.classid} }
					// this.sendPostMessage(getData2);
				}

				if(data.msg.bookid && data.msg.bookid > 0 && this.curBookId !== data.msg.bookid) {
					this.curBookId = data.msg.bookid;
				}
			} else if(data.type === "notifyMyProfile") {
				this.account = new Account();

				this.account.id = data.msg.id;
				this.account.userDiv = this.userDiv;
				this.account.gender= data.msg.gender;
				this.account.name = data.msg.name;
				this.account.nickName = data.msg.nickName;
				this.account.birthday = data.msg.birthday;
				this.account.thumbnail = data.msg.thumbnail;
				this.account.defaultThumbnail = data.msg.defaultThumbnail;
				this.account.profileThumbnail = data.msg.profileThumbnail;
				this.account.displayMode = data.msg.displayMode;
			} else if(data.type === "notifyTeacherHomeInfo") {
				this.classList = undefined;
				if(data.msg.classlist !== undefined) {
					const cloneClassList = [...data.msg.classlist];
					cloneClassList.sort((lhs, rhs) => rhs && rhs.study && lhs && lhs.study ? lhs.study.orderSeq - rhs.study.orderSeq : 0);
					this.classList = cloneClassList;
					console.log('=====> this.classList', this.classList)
				}
			} else if(data.type === "notifyClassInfo") {
				if(data.msg.curriculum === undefined) return;
				console.log('=====> data.msg.curriculum' ,data.msg.curriculum);
				this.curriculum = data.msg.curriculum[0];

				let senddata1 = { type: 'getAllStudentsProfile',  from: "content", srcFrame: 'navi', msg: ''}
				this.sendPostMessage(senddata1);

				let senddata2 = { type: 'getExtraActivityInfo',  from: "content", srcFrame: 'navi', msg: ''}
				this.sendPostMessage(senddata2);

				let senddata3 = { type: 'internalMsg', from: "content", srcFrame: 'navi', 
				msg: { 
					to: 'teaching', 
					info: { 
						type: 'notifyClassInfo',
						curriculum: data.msg.curriculum
					}
				}};
				this.sendPostMessage(senddata3);
				
				if(this._notifyClassInfo) this._notifyClassInfo();
			} else if(data.type === "notifyAllStudentsProfile") {
				if(data.msg !== undefined) this.allStudentList = data.msg;
				console.log('=====> this.allStudentList', this.allStudentList);
				if(this._notifyAllStudentList) this._notifyAllStudentList();
			} else if(data.type === "notifyLoginStudentsProfile") {
				if(data.msg !== undefined) this.loginStudentList = data.msg;
				console.log('=====> this.loginStudentList', this.loginStudentList);
				if(this._notifyLoginStudentList) this._notifyLoginStudentList();
			} else if(data.type === "notifyExtraActivityInfo") {
				if(data.msg !== undefined) this.extraActivityList = data.msg;
				console.log('=====> this.extraActivityList', this.extraActivityList);
			} else if(data.type === "notifyClassSettings") {
				this.classSettings = undefined;
				if(data.msg.settings !== undefined) this.classSettings = data.msg.settings;
				if(data.msg.access_key_id !== undefined) this.access_key_id = data.msg.access_key_id;
				if(data.msg.secret_access_key !== undefined) this.secret_access_key = data.msg.secret_access_key;

				console.log('=====> this.classSettings', this.classSettings, this.access_key_id, this.secret_access_key);
				if(this._notifyClassSettings) this._notifyClassSettings(data.msg);
				if(this._notifyClassSettingsInUnit) this._notifyClassSettingsInUnit(data.msg);
				if(this._notifyClassSettingsInLesson) this._notifyClassSettingsInLesson(data.msg);
				if(this._notifyClassSettingsForUnit) this._notifyClassSettingsForUnit(data.msg);
			} else if(data.type === "notifyDevice") {
				if(data.msg !== undefined && this._notifyDevice) this._notifyDevice(data.msg);
			} else if(data.type === "notifyMoveBook") {
				console.log('=====> notifyMoveBook', data.msg);
				if(data.msg !== undefined && this._notifyMoveBook) this._notifyMoveBook(data.msg);
			}
		} else if(data.from === 'content') {
			if(data.type=="gotoBookByKey") {
				let bookkey: number = 0;
				if(data.msg && data.msg.bookkey) bookkey = Number(data.msg.bookkey);
				if(bookkey < 1) return;
				if(this.curriculum) {
					let step: CurriculumType|undefined = undefined;
					let lesson: CurriculumType|undefined = undefined;
					for(let i = 0; i < this.curriculum.childrenList.length; i++) {
						for(let j = 0; j < this.curriculum.childrenList[i].childrenList.length; j++) {
							for(let k = 0; k < this.curriculum.childrenList[i].childrenList[j].childrenList.length; k++) {
								const book = this.curriculum.childrenList[i].childrenList[j].childrenList[k].book;
								if(book && book.cmsKey === bookkey) {
									step = this.curriculum.childrenList[i].childrenList[j].childrenList[k];
									lesson = this.curriculum.childrenList[i].childrenList[j];
									break;
								}
							}
							if(step) break;
						}
						if(step) break;
					}
					if(lesson && step && step.book) {
						let bookIdList: number[] = [];
						for(let i = 0; i < lesson.childrenList.length; i++) {
							let book = lesson.childrenList[i].book;
							if(book) bookIdList.push(book.id);
						}	
						let senddata = { type: 'gotoBook', from: "content", srcFrame: 'navi', msg: {
							bookid: step.book.id, 
							booklist: bookIdList
						}};
						this.sendPostMessage(senddata);
					}
				}	
			} else if(data.type === 'internalMsg') {
				if(data.msg.subType === 'getNaviInfo') {
					if(this.curUnitId === 0 || this.curLessonId === 0 || this.curBookId === 0) return;
					else if(!this.curriculum) return;
	
					const unit = this.curriculum.childrenList.find((item) => item.id === this.curUnitId)
					if(!unit) return;

					const lesson = unit.childrenList.find((item) => item.id === this.curLessonId)
					if(!lesson) return;
	
					const lessonjson = JSON.parse(JSON.stringify(lesson));

					const sendData= {
						type: 'internalMsg',
						from: 'content',
						srcFrame: 'navi',
						msg: {
							to: 'book',                       //'extra'|'report'|'teaching'|'pen'|'menu'
							subType: 'notifyNaviInfo',
							info: {
								curriculum: lessonjson,
								bookid: this.curBookId
							}						
						}
					};
					console.log('======> internalMsg sendData', sendData);
					window.top.postMessage(sendData, '*');	
				}
			}
		} 
	}
	@action
	public setNotifyAppStateForUnit = (fnc: ((msg: any) => void)|null) => {
		this._notifyAppStateForUnit = fnc;
	};
	@action
	public setNotifyAppStateForLesson = (fnc: ((msg: any) => void)|null) => {
		this._notifyAppStateForLesson = fnc;
	};
	@action
	public setNotifyAppStateForStudentList = (fnc: ((msg: any) => void)|null) => {
		this._notifyAppStateForStudentList = fnc;
	};
	@action
	public setNotifyClassInfo = (fnc: (() => void)|null) => {
		this._notifyClassInfo = fnc;
	};
	@action
	public setNotifyAllStudentList = (fnc: (() => void)|null) => {
		this._notifyAllStudentList = fnc;
	};
	@action
	public setNotifyLoginStudentList = (fnc: (() => void)|null) => {
		this._notifyLoginStudentList = fnc;
	};
	@action
	public setNotifyClassSettings = (fnc: ((msg: any) => void)|null) => {
		this._notifyClassSettings = fnc;
	};
	@action
	public setNotifyClassSettingsInUnit = (fnc: ((msg: any) => void)|null) => {
		this._notifyClassSettingsInUnit = fnc;
	};
	@action
	public setNotifyClassSettingsInLesson = (fnc: ((msg: any) => void)|null) => {
		this._notifyClassSettingsInLesson = fnc;
	};
	@action
	public setNotifyClassSettingsForUnit = (fnc: ((msg: any) => void)|null) => {
		this._notifyClassSettingsForUnit = fnc;
	};
	@action
	public setNotifyDevice = (fnc: ((msg: any) => void)|null) => {
		this._notifyDevice = fnc;
	};
	@action
	public setNotifyMoveBook = (fnc: ((msg: any) => void)|null) => {
		this._notifyMoveBook = fnc;
	};
}