import React from "react"
import Image from "next/image"

import styles from "./Comment.module.css"

const Comment = ({ commentList = [], commentCount = 0 }) => {
  if (commentList.length >= 0) {
    return (
      <div>
        <div className={styles.title}>
          <Image src="/comment.svg" width="24" height="24" alt="" />

          <span className={styles.ml12}>全部评论（{commentCount}）</span>
        </div>

        <div className={styles.comment}>
          {commentList.map((item) => (
            <div className={styles["comment-item"]} key={item.commentId}>
              <Image src={item.headImgUrl} width="30" height="30" alt="" />

              <div className={styles["comment-item-right"]}>
                <div className={styles["comment-item-right-title"]}>
                  <span>{item.accountName}</span>
                  <span>{item.createTime}</span>
                </div>

                <div className={styles["comment-item-right-content"]}>
                  {item.content}
                  <div className={styles["comment-reply"]}>
                    {item.replyCommentList.map((replyItem) => (
                      <div
                        className={styles["comment-item"]}
                        key={replyItem.replyAccountId}
                      >
                        <Image
                          src={replyItem.headImgUrl}
                          width="30"
                          height="30"
                          alt=""
                        />
                        <div className={styles["comment-item-right"]}>
                          <div className={styles["comment-item-right-title"]}>
                            <span>{replyItem.accountName}</span>
                            <span>{replyItem.createTime}</span>
                          </div>

                          <div className={styles["comment-item-right-content"]}>
                            回复
                            <span className={styles['reply-comment-alert']}>@{replyItem.replyAccountName}</span>
                            {replyItem.content}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div></div>
    </div>
  )
}

export default Comment
