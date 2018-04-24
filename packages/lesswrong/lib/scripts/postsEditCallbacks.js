import { Posts, Comments } from 'meteor/example-forum';
import { runCallbacks } from 'meteor/vulcan:core';

Vulcan.runPostEditCallbacks = () => {
  let postCount = 0;
  // To fetch all posts from a given user:
  // const posts = Posts.find({draft:{$ne:true}, userId:'N9zj5qpTfqmbn9dro'}).fetch()
  // To fetch all posts, starting with most recent:
  const posts = Posts.find({draft:{$ne:true}}, {skip:998, limit:10000, sort:{createdAt:-1}}).fetch()
  console.log(`Found ${posts.length} posts, triggering Edit Callbacks`)
  posts.forEach((post) => {
    if (post.htmlBody) {
      try {
        Posts.update(post._id,runCallbacks("posts.edit.sync", {$set: {htmlBody:post.htmlBody}}, post))
      } catch (e) {
        console.log(e)
      }
    }
    if (postCount % 1 == 0) {
      console.log(`${postCount} posts / ${posts.length}, ${post._id}, ${post.title}`);
    }
    postCount ++
  })
}