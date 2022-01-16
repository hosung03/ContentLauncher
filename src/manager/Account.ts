import { UserDiv, Gender, MemberDataType } from '../types';
import serverHelper from '../utils/ServerHelper';

class Account {
  private _userDiv: UserDiv = UserDiv.NONE;
  private _gender: Gender = Gender.FEMALE;
  private _id: number = 0;
  private _name: string = '';
  private _nickName: string = '';
  private _birthday: string = '';
  private _thumbnail: string = '';
  private _defaultThumbnail: string = '';
  private _profileThumbnail: string = '';
  private _displayMode: number = 0;

  resetMemberData() {
    this.id = 0;
    this.name = '';
    this.nickName = '';
    this.birthday = '';
    this.thumbnail = '';
    this.defaultThumbnail = '';
    this.profileThumbnail = '';
    this.displayMode = 0;
  }

  setMemberData(memberData: MemberDataType) {
    this.id = memberData.id;
    this.userDiv = memberData.userDiv;
    this.name = memberData.name;
    this.nickName = memberData.nickName;
    this.gender = memberData.gender === 'M' ? Gender.MALE : Gender.FEMALE;
    this.birthday = memberData.birthday;
    this.thumbnail = memberData.thumbnail;
    this.defaultThumbnail = memberData.defaultThumbnail;
    this.profileThumbnail = memberData.profileThumbnail;
    this.displayMode = memberData.displayMode;
  }

  get userDiv(): UserDiv {
    return this._userDiv;
  }
  set userDiv(newUserDiv: UserDiv) {
    this._userDiv = newUserDiv;
  }
  get id(): number {
    return this._id;
  }
  set id(newId: number) {
    this._id = newId;
  }
  get name(): string {
    return this._name;
  }
  set name(newName: string) {
    this._name = newName;
  }
  get nickName(): string {
    return this._nickName;
  }
  set nickName(newName: string) {
    this._nickName = newName;
  }
  get gender(): Gender {
    return this._gender;
  }
  get genderStr(): string {
    return this._gender === Gender.MALE ? 'M' : 'F';
  }
  set gender(newGender: Gender) {
    this._gender = newGender;
  }
  get birthday(): string {
    return this._birthday;
  }
  set birthday(newBirthday: string) {
    this._birthday = newBirthday;
  }
  get thumbnail(): string {
    return this._thumbnail;
  }
  get thumbnailUri(): string {
    return serverHelper.makeUrl(this._thumbnail);
  }
  set thumbnail(newThumb: string) {
    this._thumbnail = newThumb;
  }
  get defaultThumbnail(): string {
    return this._defaultThumbnail;
  }
  get defaultThumbnailUri(): string {
    return serverHelper.makeUrl(this._defaultThumbnail);
  }
  set defaultThumbnail(newThumb: string) {
    this._defaultThumbnail = newThumb;
  }
  get profileThumbnail(): string {
    return this._profileThumbnail;
  }
  get profileThumbnailUri(): string {
    return serverHelper.makeUrl(this._profileThumbnail);
  }
  set profileThumbnail(newThumb: string) {
    this._profileThumbnail = newThumb;
  }
  get displayMode(): number {
    return this._displayMode;
  }
  set displayMode(newDisplayMode: number) {
    this._displayMode = newDisplayMode;
  }
}

export default Account;
