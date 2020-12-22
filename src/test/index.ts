import { useAll } from 'hooks/useAll';
import { useById } from 'hooks/useById';
import { useDelete } from 'hooks/useDelete';
import { useMany } from 'hooks/useMany';
import { usePatch } from 'hooks/usePatch';
import { usePost } from 'hooks/usePost';
import { usePut } from 'hooks/usePut';
import { CrudService } from 'nest-utilities-client';

interface IUser {
  name: string;
}

class S extends CrudService<IUser> {
  constructor() {
    super('');
  }
}

const service = new S();

const all = useAll(service);
const byId = useById(service);
const delet = useDelete(service);
const many = useMany(service);
const patch = usePatch(service);
const post = usePost(service);
const put = usePut(service);
