import {SqliteQueryCompiler, type ValueNode} from 'kysely'

export class S3SelectQueryCompiler extends SqliteQueryCompiler {
  protected visitValue(node: ValueNode): void {
    this.appendImmediateValue(node.value)
  }
}
