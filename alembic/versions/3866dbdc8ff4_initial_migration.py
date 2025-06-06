"""initial migration

Revision ID: 3866dbdc8ff4
Revises: 
Create Date: 2025-04-23 12:51:48.286947

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '3866dbdc8ff4'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('author',
    sa.Column('author_name', sa.String(length=255), nullable=False),
    sa.Column('author_bio', sa.Text(), nullable=True),
    sa.Column('id', sa.BigInteger(), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_author_id'), 'author', ['id'], unique=False)
    op.create_table('category',
    sa.Column('category_name', sa.String(length=120), nullable=False),
    sa.Column('category_desc', sa.String(length=255), nullable=True),
    sa.Column('id', sa.BigInteger(), nullable=False),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('category_name')
    )
    op.create_index(op.f('ix_category_id'), 'category', ['id'], unique=False)
    op.create_table('user',
    sa.Column('first_name', sa.String(length=50), nullable=False),
    sa.Column('last_name', sa.String(length=50), nullable=False),
    sa.Column('email', sa.String(length=70), nullable=False),
    sa.Column('password', sa.String(length=255), nullable=False),
    sa.Column('admin', sa.Boolean(), nullable=True),
    sa.Column('id', sa.BigInteger(), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_user_email'), 'user', ['email'], unique=True)
    op.create_index(op.f('ix_user_id'), 'user', ['id'], unique=False)
    op.create_table('book',
    sa.Column('category_id', sa.BigInteger(), nullable=False),
    sa.Column('author_id', sa.BigInteger(), nullable=False),
    sa.Column('book_title', sa.String(length=255), nullable=False),
    sa.Column('book_summary', sa.Text(), nullable=True),
    sa.Column('book_price', sa.Numeric(precision=5, scale=2), nullable=False),
    sa.Column('book_cover_photo', sa.String(length=20), nullable=True),
    sa.Column('id', sa.BigInteger(), nullable=False),
    sa.ForeignKeyConstraint(['author_id'], ['author.id'], ),
    sa.ForeignKeyConstraint(['category_id'], ['category.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_book_id'), 'book', ['id'], unique=False)
    op.create_table('order',
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.Column('order_date', sa.DateTime(), nullable=True),
    sa.Column('order_amount', sa.Numeric(precision=8, scale=2), nullable=False),
    sa.Column('id', sa.BigInteger(), nullable=False),
    sa.ForeignKeyConstraint(['user_id'], ['user.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_order_id'), 'order', ['id'], unique=False)
    op.create_table('discount',
    sa.Column('book_id', sa.BigInteger(), nullable=False),
    sa.Column('discount_start_date', sa.Date(), nullable=False),
    sa.Column('discount_end_date', sa.Date(), nullable=False),
    sa.Column('discount_price', sa.Numeric(precision=5, scale=2), nullable=True),
    sa.Column('id', sa.BigInteger(), nullable=False),
    sa.ForeignKeyConstraint(['book_id'], ['book.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_discount_id'), 'discount', ['id'], unique=False)
    op.create_table('order_item',
    sa.Column('order_id', sa.BigInteger(), nullable=False),
    sa.Column('book_id', sa.BigInteger(), nullable=False),
    sa.Column('quantity', sa.SmallInteger(), nullable=False),
    sa.Column('price', sa.Numeric(precision=5, scale=2), nullable=False),
    sa.Column('id', sa.BigInteger(), nullable=False),
    sa.ForeignKeyConstraint(['book_id'], ['book.id'], ),
    sa.ForeignKeyConstraint(['order_id'], ['order.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_order_item_id'), 'order_item', ['id'], unique=False)
    op.create_table('review',
    sa.Column('book_id', sa.BigInteger(), nullable=False),
    sa.Column('review_title', sa.String(length=120), nullable=False),
    sa.Column('review_details', sa.Text(), nullable=True),
    sa.Column('review_date', sa.DateTime(), nullable=True),
    sa.Column('rating_start', sa.Integer(), nullable=True),
    sa.Column('id', sa.BigInteger(), nullable=False),
    sa.ForeignKeyConstraint(['book_id'], ['book.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_review_id'), 'review', ['id'], unique=False)
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_index(op.f('ix_review_id'), table_name='review')
    op.drop_table('review')
    op.drop_index(op.f('ix_order_item_id'), table_name='order_item')
    op.drop_table('order_item')
    op.drop_index(op.f('ix_discount_id'), table_name='discount')
    op.drop_table('discount')
    op.drop_index(op.f('ix_order_id'), table_name='order')
    op.drop_table('order')
    op.drop_index(op.f('ix_book_id'), table_name='book')
    op.drop_table('book')
    op.drop_index(op.f('ix_user_id'), table_name='user')
    op.drop_index(op.f('ix_user_email'), table_name='user')
    op.drop_table('user')
    op.drop_index(op.f('ix_category_id'), table_name='category')
    op.drop_table('category')
    op.drop_index(op.f('ix_author_id'), table_name='author')
    op.drop_table('author')
    # ### end Alembic commands ###
